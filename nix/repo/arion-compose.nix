{
  inputs,
  cell,
}: let
  inherit (inputs.std) lib;
  api-build = inputs.nixpkgs.buildNpmPackage rec {
    pname = "E-CommerceAPI-Build";
    src = "${inputs.self}/app";
    version = (builtins.fromJSON (builtins.readFile "${src}/package.json")).version;

    npmPackFlags = ["--ignore-scripts"];
    npmDepsHash = "sha256-8LbIw3Ug4ez2/S684vy1F8hWUfKtvKULkwXBYSfdScE=";
    env.OUTPUT_STANDALONE = true;

    postBuild = ''
      # Add a shebang to the server js file, then patch the shebang.
      sed -i '1s|^|#!/usr/bin/env node\n|' .next/standalone/server.js
      patchShebangs .next/standalone/server.js
    '';

    installPhase = ''
      runHook preInstall

      mkdir -p $out/{share,bin}

      cp -r .next/standalone $out/share/${pname}/
      cp -r public $out/share/${pname}/public

      mkdir -p $out/share/${pname}/.next
      cp -r .next/static $out/share/${pname}/.next/static

      chmod +x $out/share/${pname}/server.js

      makeWrapper $out/share/${pname}/server.js $out/bin/${pname} \
        --set-default PORT 3000 \

      runHook postInstall
    '';

    meta = {
      description = "An E-Commerce RESTful API & website built with NextJS.";
    };
  };

  api-image = let
    nginxConf = inputs.nixpkgs.writeText "nginx.conf" ''
      user nobody nobody;
      daemon off;
      error_log /dev/stdout info;
      pid /dev/null;
      events {}
      http {
        access_log /dev/stdout;
        server {
          listen      80  default_server;
          listen [::]:80  default_server;
          listen      443 default_server ssl;
          listen [::]:443 default_server ssl;

          ssl_certificate     "${inputs.self}/localhost.crt";
          ssl_certificate_key "${inputs.self}/localhost.key";

          location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
          }

        }
      }
    '';

    # NOTE: seeding & db migration has to be done manually...
    entry-script = inputs.nixpkgs.writeScript "entry-script.sh" ''
      #!${inputs.nixpkgs.runtimeShell}
      ${api-build}/bin/E-CommerceAPI-Build &
       nginx -c ${nginxConf}
    '';
  in
    inputs.nixpkgs.dockerTools.buildLayeredImage {
      name = "E-Commerce-API";
      tag = "latest";

      contents = [
        inputs.nixpkgs.dockerTools.fakeNss
        inputs.nixpkgs.nginx
        api-build
      ];

      extraCommands = ''
        mkdir -p tmp/nginx_client_body
        mkdir -p var/log/nginx
      '';

      config = {
        Cmd = ["${entry-script}"];
        ExposedPorts = {
          "443/tcp" = {};
          "80/tcp" = {};
        };
        Env = [
          "HOSTNAME=127.0.0.1"
          "TZ=Europe/Berlin"
          "DATABASE_URL=postgres://db_owner:secure_password@commerce-db-service:5433/commercedb"
          "TOKEN_SECRET=53477b5b3831d05e390156ae0a04c3af04fafdc8ec6554076c51e55df4f1f9517fcaba43b06cf5906f28cb9da73518c55b79c302136f33ceec60d435a4b85042"
          "TOKEN_KEY=M/JIRJRRdpLpb//kBp7yd2rU3iAWB/pc5EgEIu7EUS0="
          "TOKEN_ISSUER=https://api.e-commerce-api.com/"
        ];
      };
    };

  db-image = let
    nglib = inputs.nixng.nglib;
  in
    nglib.makeSystem {
      inherit (inputs) nixpkgs;
      system = "x86_64-linux";
      name = "e-commerce-postgres";
      config = {pkgs, ...}: {
        config = {
          dumb-init = {
            enable = true;
            type.services = {};
          };
          nix = {
            loadNixDb = true;
            persistNix = "/nix-persist";
            config = {
              experimental-features = ["nix-command" "flakes"];
              sandbox = true;
              trusted-public-keys = [
                "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
              ];
              substituters = ["https://cache.nixos.org/"];
            };
          };
          services.postgresql = {
            enable = true;
            package = pkgs.postgresql;
            enableTCPIP = true;
            initdbArgs = ["--encoding=UTF-8" "--locale=C"];
            port = 5433;
            initialScript = pkgs.writeText "db-initScript" ''
              CREATE USER db_owner WITH LOGIN PASSWORD 'secure_password';
              GRANT ALL PRIVILEGES ON DATABASE commercedb TO db_owner;
              \c commercedb;
              GRANT ALL ON SCHEMA public TO db_owner;
            '';
            ensureDatabases = ["commercedb"];
            authentication = ''
              host    all             db_owner             0.0.0.0/0            md5
            '';
          };
        };
      };
    };
in
  builtins.mapAttrs (_: lib.dev.mkArion) {
    e-commerce-api-service = {
      project.name = "e-commerce-api";
      docker-compose.volumes = {commerce-data = {};};

      services = {
        pko-site = {
          build.image =
            inputs.nixpkgs.lib.mkForce api-image;
          service = {
            container_name = "E-Commerce-API-Service";
            stop_signal = "SIGINT";
            ports = ["443:443" "80:80"];
            links = ["commerce-db-service"];
          };
        };

        commerce-db-service = {
          build.image =
            inputs
            .nixpkgs
            .lib
            .mkForce
            (db-image
              .config
              .system
              .build
              .ociImage
              .build);
          service = {
            useHostStore = true;
            container_name = "Commerce-Postgres-Service";
            stop_signal = "SIGINT";
            ports = ["5433:5433"];
            volumes = ["commerce-data:/var/lib/postgresql/data"];
          };
        };
      };
    };
  }
