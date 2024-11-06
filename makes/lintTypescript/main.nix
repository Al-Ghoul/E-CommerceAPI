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
      npmDepsHash = "sha256-95pEfE8zJjdU+rkQ/JrFT0z8gWp6eIzctXS1Ct8yBmk=";

      checkPhase = ''
        runHook preCheck
        npm run lint
        runHook postCheck
      '';

      meta = {
        description = "A job that Lints & checks typescript code";
      };
    }
