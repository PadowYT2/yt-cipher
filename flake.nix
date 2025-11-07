{
  description = "An http api wrapper for yt-dlp/ejs";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    ...
  } @ inputs:
    {
      nixosModules.default = import ./module.nix;
      overlays.default = final: prev: {
        yt-cipher = prev.callPackage ./package.nix {};
      };
    }
    // (inputs.flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [self.overlays.default];
      };
    in {
      packages = {
        yt-cipher = pkgs.yt-cipher;
      };
    }));
}
