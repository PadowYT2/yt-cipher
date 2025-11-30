{
  lib,
  stdenvNoCC,
  bun,
  makeBinaryWrapper,
  writableTmpDirAsHomeHook,
}:
stdenvNoCC.mkDerivation (finalAttrs: {
  pname = "yt-cipher";
  version = "unstable-2025-11-30";

  src = lib.cleanSource ./.;

  node_modules = stdenvNoCC.mkDerivation {
    pname = "yt-cipher-node_modules";
    version = finalAttrs.version;

    src = finalAttrs.src;

    impureEnvVars = lib.fetchers.proxyImpureEnvVars ++ ["GIT_PROXY_COMMAND" "SOCKS_SERVER"];

    nativeBuildInputs = [bun writableTmpDirAsHomeHook];

    dontConfigure = true;

    buildPhase = ''
      runHook preBuild

      export BUN_INSTALL_CACHE_DIR=$(mktemp -d)

      bun install --force --frozen-lockfile --ignore-scripts --no-progress --production

      runHook postBuild
    '';

    installPhase = ''
      runHook preInstall

      mkdir -p $out/node_modules
      cp -R ./node_modules $out

      runHook postInstall
    '';

    dontFixup = true;

    outputHash = "sha256-3gushLvXbaPYo1hSdaDYTb/aDxA/0aKHvTjxZi9Kmv8=";
    outputHashAlgo = "sha256";
    outputHashMode = "recursive";
  };

  nativeBuildInputs = [bun makeBinaryWrapper];

  configurePhase = ''
    runHook preConfigure

    cp -R ${finalAttrs.node_modules}/. .

    runHook postConfigure
  '';

  buildPhase = ''
    runHook preBuild

    bun build --compile --target bun --minify server.ts --outfile dist/yt-cipher

    runHook postBuild
  '';

  dontStrip = true;

  installPhase = ''
    runHook preInstall

    install -Dm755 dist/yt-cipher $out/bin/yt-cipher

    runHook postInstall
  '';

  meta = {
    description = "An http api wrapper for yt-dlp/ejs";
    homepage = "https://github.com/kikkia/yt-cipher";
    license = lib.licenses.unfree;
  };
})
