{
  pkgs ? import <nixpkgs> { },
  ...
}:
let
  lib = pkgs.lib;
  extractTarball =
    src:
    pkgs.runCommand "extracted-${src.name}" { } ''
      mkdir "$out"
      ${pkgs.libarchive}/bin/bsdtar -xf ${src} --strip-components 1 -C "$out"
    '';
  packages = {
    "node_modules/@biomejs/biome/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@biomejs/biome/-/biome-2.2.5.tgz";
        hash = "sha512-zcIi+163Rc3HtyHbEO7CjeHq8DjQRs40HsGbW6vx2WI0tg8mYQOPouhvHSyEnCBAorfYNnKdR64/IxO7xQ5faw==";
      }
    );
    "node_modules/@biomejs/cli-darwin-arm64/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@biomejs/cli-darwin-arm64/-/cli-darwin-arm64-2.2.5.tgz";
        hash = "sha512-MYT+nZ38wEIWVcL5xLyOhYQQ7nlWD0b/4mgATW2c8dvq7R4OQjt/XGXFkXrmtWmQofaIM14L7V8qIz/M+bx5QQ==";
      }
    );
    "node_modules/@biomejs/cli-darwin-x64/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@biomejs/cli-darwin-x64/-/cli-darwin-x64-2.2.5.tgz";
        hash = "sha512-FLIEl73fv0R7dI10EnEiZLw+IMz3mWLnF95ASDI0kbx6DDLJjWxE5JxxBfmG+udz1hIDd3fr5wsuP7nwuTRdAg==";
      }
    );
    "node_modules/@biomejs/cli-linux-arm64/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@biomejs/cli-linux-arm64/-/cli-linux-arm64-2.2.5.tgz";
        hash = "sha512-5DjiiDfHqGgR2MS9D+AZ8kOfrzTGqLKywn8hoXpXXlJXIECGQ32t+gt/uiS2XyGBM2XQhR6ztUvbjZWeccFMoQ==";
      }
    );
    "node_modules/@biomejs/cli-linux-arm64-musl/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@biomejs/cli-linux-arm64-musl/-/cli-linux-arm64-musl-2.2.5.tgz";
        hash = "sha512-5Ov2wgAFwqDvQiESnu7b9ufD1faRa+40uwrohgBopeY84El2TnBDoMNXx6iuQdreoFGjwW8vH6k68G21EpNERw==";
      }
    );
    "node_modules/@biomejs/cli-linux-x64/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@biomejs/cli-linux-x64/-/cli-linux-x64-2.2.5.tgz";
        hash = "sha512-fq9meKm1AEXeAWan3uCg6XSP5ObA6F/Ovm89TwaMiy1DNIwdgxPkNwxlXJX8iM6oRbFysYeGnT0OG8diCWb9ew==";
      }
    );
    "node_modules/@biomejs/cli-linux-x64-musl/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@biomejs/cli-linux-x64-musl/-/cli-linux-x64-musl-2.2.5.tgz";
        hash = "sha512-AVqLCDb/6K7aPNIcxHaTQj01sl1m989CJIQFQEaiQkGr2EQwyOpaATJ473h+nXDUuAcREhccfRpe/tu+0wu0eQ==";
      }
    );
    "node_modules/@biomejs/cli-win32-arm64/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@biomejs/cli-win32-arm64/-/cli-win32-arm64-2.2.5.tgz";
        hash = "sha512-xaOIad4wBambwJa6mdp1FigYSIF9i7PCqRbvBqtIi9y29QtPVQ13sDGtUnsRoe6SjL10auMzQ6YAe+B3RpZXVg==";
      }
    );
    "node_modules/@biomejs/cli-win32-x64/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@biomejs/cli-win32-x64/-/cli-win32-x64-2.2.5.tgz";
        hash = "sha512-F/jhuXCssPFAuciMhHKk00xnCAxJRS/pUzVfXYmOMUp//XW7mO6QeCjsjvnm8L4AO/dG2VOB0O+fJPiJ2uXtIw==";
      }
    );
    "node_modules/@opentelemetry/api/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@opentelemetry/api/-/api-1.9.0.tgz";
        hash = "sha512-3giAOQvZiH5F9bMlMiv8+GSPMeqg0dbaeo58/0SlA9sxSqZhnUtxzX9/2FzyhS9sWQf5S0GJE0AKBrFqjpeYcg==";
      }
    );
    "node_modules/@sinclair/typebox/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@sinclair/typebox/-/typebox-0.34.41.tgz";
        hash = "sha512-6gS8pZzSXdyRHTIqoqSVknxolr1kzfy4/CeDnrzsVz8TTIWUbOBr6gnzOmTYJ3eXQNh4IYHIGi5aIL7sOZ2G/g==";
      }
    );
    "node_modules/@tsconfig/strictest/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@tsconfig/strictest/-/strictest-2.0.6.tgz";
        hash = "sha512-tPOhmDhIUcDjvpDDYyiUdssP84Eqm7n5KxJe5J3/g+s6xoDIPAf+SIn06dhw7VkhxIvLOnhDDrX7tsqMHNEhDg==";
      }
    );
    "node_modules/@types/bun/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@types/bun/-/bun-1.2.23.tgz";
        hash = "sha512-le8ueOY5b6VKYf19xT3McVbXqLqmxzPXHsQT/q9JHgikJ2X22wyTW3g3ohz2ZMnp7dod6aduIiq8A14Xyimm0A==";
      }
    );
    "node_modules/@types/node/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@types/node/-/node-24.7.0.tgz";
        hash = "sha512-IbKooQVqUBrlzWTi79E8Fw78l8k1RNtlDDNWsFZs7XonuQSJ8oNYfEeclhprUldXISRMLzBpILuKgPlIxm+/Yw==";
      }
    );
    "node_modules/@types/react/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/@types/react/-/react-19.2.0.tgz";
        hash = "sha512-1LOH8xovvsKsCBq1wnT4ntDUdCJKmnEakhsuoUSy6ExlHCkGP2hqnatagYTgFk6oeL0VU31u7SNjunPN+GchtA==";
      }
    );
    "node_modules/astring/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/astring/-/astring-1.9.0.tgz";
        hash = "sha512-LElXdjswlqjWrPpJFg1Fx4wpkOCxj1TDHlSV4PlaRxHGWko024xICaa97ZkMfs6DRKlCguiAI+rbXv5GWwXIkg==";
      }
    );
    "node_modules/bintrees/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/bintrees/-/bintrees-1.0.2.tgz";
        hash = "sha512-VOMgTMwjAaUG580SXn3LacVgjurrbMme7ZZNYGSSV7mmtY6QQRh0Eg3pwIcntQ77DErK1L0NxkbetjcoXzVwKw==";
      }
    );
    "node_modules/bun-types/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/bun-types/-/bun-types-1.2.23.tgz";
        hash = "sha512-R9f0hKAZXgFU3mlrA0YpE/fiDvwV0FT9rORApt2aQVWSuJDzZOyB5QLc0N/4HF57CS8IXJ6+L5E4W1bW6NS2Aw==";
      }
    );
    "node_modules/cookie/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/cookie/-/cookie-1.0.2.tgz";
        hash = "sha512-9Kr/j4O16ISv8zBBhJoi4bXOYNTkFLOqSL3UDB0njXxCXNezjeyVrJyGOWtgfs/q2km1gwBcfH8q1yEGoMYunA==";
      }
    );
    "node_modules/csstype/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/csstype/-/csstype-3.1.3.tgz";
        hash = "sha512-M1uQkMl8rQK/szD0LNhtqxIPLpimGm8sOBwU7lLnCpSbTyY3yeU1Vc7l4KT5zT4s/yOxHH5O7tIuuLOCnLADRw==";
      }
    );
    "node_modules/ejs/" = pkgs.fetchgit {
      url = "https://github.com/yt-dlp/ejs";
      rev = "2655b1f";
      hash = "sha512-tX7EyPx8rPBYlzEVgC9+QUXNiip9hRHH+RTkBxxoxLjeJMRjIq0I6LcDo7Q0k8YO/9ojd+9C4wTzk+1ss2X2Ng==";
    };
    "node_modules/elysia/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/elysia/-/elysia-1.4.9.tgz";
        hash = "sha512-BWNhA8DoKQvlQTjAUkMAmNeso24U+ibZxY/8LN96qSDK/6eevaX59r3GISow699JPxSnFY3gLMUzJzCLYVtbvg==";
      }
    );
    "node_modules/exact-mirror/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/exact-mirror/-/exact-mirror-0.2.2.tgz";
        hash = "sha512-CrGe+4QzHZlnrXZVlo/WbUZ4qQZq8C0uATQVGVgXIrNXgHDBBNFD1VRfssRA2C9t3RYvh3MadZSdg2Wy7HBoQA==";
      }
    );
    "node_modules/fast-decode-uri-component/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/fast-decode-uri-component/-/fast-decode-uri-component-1.0.1.tgz";
        hash = "sha512-WKgKWg5eUxvRZGwW8FvfbaH7AXSh2cL+3j5fMGzUMCxWBJ3dV3a7Wz8y2f/uQ0e3B6WmodD3oS54jTQ9HVTIIg==";
      }
    );
    "node_modules/lru-cache/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/lru-cache/-/lru-cache-11.2.2.tgz";
        hash = "sha512-F9ODfyqML2coTIsQpSkRHnLSZMtkU8Q+mSfcaIyKwy58u+8k5nvAYeiNhsyMARvzNcXJ9QfWVrcPsC9e9rAxtg==";
      }
    );
    "node_modules/meriyah/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/meriyah/-/meriyah-6.1.4.tgz";
        hash = "sha512-Sz8FzjzI0kN13GK/6MVEsVzMZEPvOhnmmI1lU5+/1cGOiK3QUahntrNNtdVeihrO7t9JpoH75iMNXg6R6uWflQ==";
      }
    );
    "node_modules/openapi-types/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/openapi-types/-/openapi-types-12.1.3.tgz";
        hash = "sha512-N4YtSYJqghVu4iek2ZUvcN/0aqH1kRDuNqzcycDxhOUpg7GdvLa2F3DgS6yBNhInhv2r/6I0Flkn7CqL8+nIcw==";
      }
    );
    "node_modules/prom-client/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/prom-client/-/prom-client-15.1.3.tgz";
        hash = "sha512-6ZiOBfCywsD4k1BN9IX0uZhF+tJkV8q8llP64G5Hajs4JOeVLPCwpPVcpXy3BwYiUGgyJzsJJQeOIv7+hDSq8g==";
      }
    );
    "node_modules/tdigest/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/tdigest/-/tdigest-0.1.2.tgz";
        hash = "sha512-+G0LLgjjo9BZX2MfdvPfH+MKLCrxlXSYec5DaPYP1fe6Iyhf0/fSmJ0bFiZ1F8BT6cGXl2LpltQptzjXKWEkKA==";
      }
    );
    "node_modules/typescript/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz";
        hash = "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==";
      }
    );
    "node_modules/undici-types/" = extractTarball (
      pkgs.fetchurl {
        url = "https://registry.npmjs.org/undici-types/-/undici-types-7.14.0.tgz";
        hash = "sha512-QQiYxHuyZ9gQUIrmPo3IA+hUl4KYk8uSA7cHrcKd/l3p1OTpZcM0Tbp9x7FAtXdAYhlasd60ncPpgu6ihG6TOA==";
      }
    );
  };
  packageCommands = lib.pipe packages [
    (lib.mapAttrsToList (
      modulePath: package: ''
        mkdir -p "$out/lib/${modulePath}"
        cp -Lr ${package}/* "$out/lib/${modulePath}"
        chmod -R u+w "$out/lib/${modulePath}"
      ''
    ))
    (lib.concatStringsSep "\n")
  ];
in
(pkgs.runCommand "node_modules" { buildInputs = [ pkgs.nodejs ]; } ''
  ${packageCommands}
  mkdir -p "$out/lib/node_modules/.bin"
  patchShebangs --host "$out/lib/node_modules/@biomejs/biome/bin/biome"
  ln -s "$out/lib/node_modules/@biomejs/biome/bin/biome" "$out/lib/node_modules/.bin/biome"
  patchShebangs --host "$out/lib/node_modules/astring/bin/astring"
  ln -s "$out/lib/node_modules/astring/bin/astring" "$out/lib/node_modules/.bin/astring"
  patchShebangs --host "$out/lib/node_modules/typescript/bin/tsc"
  ln -s "$out/lib/node_modules/typescript/bin/tsc" "$out/lib/node_modules/.bin/tsc"
  patchShebangs --host "$out/lib/node_modules/typescript/bin/tsserver"
  ln -s "$out/lib/node_modules/typescript/bin/tsserver" "$out/lib/node_modules/.bin/tsserver"
  ln -s "$out/lib/node_modules/.bin" "$out/bin"
'')
