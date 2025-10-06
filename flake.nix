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
        yt-cipher = prev.stdenv.mkDerivation rec {
          pname = "yt-cipher";
          version = "unstable";

          src = prev.lib.cleanSource ./.;
          bun = import ./bun.nix {pkgs = prev;};

          nativeBuildInputs = [prev.makeWrapper];
          buildInputs = [prev.bun];

          installPhase = ''
            runHook preInstall

            mkdir -p $out/lib/yt-cipher
            cp -r ${src}/* $out/lib/yt-cipher/
            ln -s ${bun}/lib/node_modules $out/lib/yt-cipher/node_modules

            makeWrapper ${prev.bun}/bin/bun $out/bin/yt-cipher \
              --chdir "$out/lib/yt-cipher" \
              --add-flags "run start"

            runHook postInstall
          '';
        };
      };
    }
    // (inputs.flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [self.overlays.default];
      };
    in {
      packages.default = pkgs.yt-cipher;
    }));
}
