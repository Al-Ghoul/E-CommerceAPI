{
  description = "E-Commerce API's environment";

  inputs = {
    devshell.url = "github:numtide/devshell";
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    nixng = {
      url = "github:nix-community/NixNG/master";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = {
    devshell,
    nixpkgs,
    nixng,
    ...
  }: let
    system = "x86_64-linux";
  in {
    pkgs = nixpkgs.legacyPackages.${system};

    devShells.${system}.default = let
      pkgs = import nixpkgs {
        inherit system;

        overlays = [devshell.overlays.default];
      };
    in
      pkgs.devshell.mkShell {
        imports = [(pkgs.devshell.importTOML ./devshell.toml)];
      };

    db-image = let
      nglib = nixng.nglib;
    in
      nglib.makeSystem {
        inherit nixpkgs;
        inherit system;
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
  };
}
