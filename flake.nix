{
  description = "E-Commerce API's environment";

  inputs = {
    devshell.url = "github:numtide/devshell";
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    nixng = {
      url = "github:nix-community/NixNG/master";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    std = {
      url = "github:divnix/std";
      inputs = {
        nixpkgs.follows = "nixpkgs";
        devshell.url = "github:numtide/devshell";
      };
    };

    makes = {
      url = "github:Al-Ghoul/makes";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = {std, ...} @ inputs:
    std.growOn {
      inherit inputs;
      cellsFrom = ./nix;
      cellBlocks = with std.blockTypes; [
        (devshells "shells")
      ];
    } {
      devShells = std.harvest inputs.self ["repo" "shells"];
    };
}
