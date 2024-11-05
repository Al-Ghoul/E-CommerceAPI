# /path/to/my/project/makes/example/main.nix
{__nixpkgs__, ...}: let
  pkgs = __nixpkgs__;
in
  with pkgs;
    buildNpmPackage rec {
      name = "E-CommerceAPI Linting";
      src = ../../app;
      version = (builtins.fromJSON (builtins.readFile "${src}/package.json")).version;

      doCheck = true;
      doDist = false;
      dontFixup = true;

      dontNpmBuild = true;
      npmPackFlags = ["--ignore-scripts"];
      npmDepsHash = "sha256-8LbIw3Ug4ez2/S684vy1F8hWUfKtvKULkwXBYSfdScE=";

      checkPhase = ''
        runHook preCheck
        npm run lint
        runHook postCheck
      '';

      meta = {
        description = "An E-Commerce RESTful & website built with NextJS.";
      };
    }
