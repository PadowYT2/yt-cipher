{
  config,
  lib,
  pkgs,
  ...
}:
with lib; let
  cfg = config.programs.yt-cipher;
in {
  options.programs.yt-cipher = {
    enable = mkEnableOption "yt-cipher service";

    package = mkOption {
      type = types.package;
      default = pkgs.yt-cipher;
      defaultText = "pkgs.yt-cipher";
      description = "The yt-cipher package to use";
    };

    apiToken = mkOption {
      type = types.nullOr types.str;
      default = null;
      description = "A required password to access this service";
    };

    apiTokenFile = mkOption {
      type = types.nullOr types.path;
      default = null;
      description = "Path to a file containing the API token";
    };

    host = mkOption {
      type = types.str;
      default = "0.0.0.0";
      description = "Sets the hostname for the bun server";
    };

    port = mkOption {
      type = types.str;
      default = "8001";
      description = "Port to run the api on";
    };

    environment = mkOption {
      type = types.listOf types.str;
      default = [];
      description = "Additional environment variables to pass to the service";
      example = ["MAX_THREADS=3"];
    };

    openFirewall = mkOption {
      type = types.bool;
      default = false;
      description = "Whether to open the specified port in the firewall";
    };
  };

  config = mkIf cfg.enable {
    assertions = [
      {
        assertion = !(cfg.apiToken != null && cfg.apiTokenFile != null);
        message = "Cannot set both programs.yt-cipher.apiToken and programs.yt-cipher.apiTokenFile";
      }
    ];

    networking.firewall.allowedTCPPorts = lib.optionals cfg.openFirewall [(lib.toInt cfg.port)];

    systemd.services.yt-cipher = {
      description = "yt-cipher service";
      after = ["network.target"];
      wantedBy = ["multi-user.target"];

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/yt-cipher";
        User = "yt-cipher";
        Group = "yt-cipher";
        Restart = "on-failure";
        CacheDirectory = "yt-cipher";

        Environment = ["HOST=${cfg.host}" "PORT=${cfg.port}"] ++ (lib.optional (cfg.apiToken != null) "API_TOKEN=${cfg.apiToken}") ++ cfg.environment;
        LoadCredential = lib.optional (cfg.apiTokenFile != null) "API_TOKEN:${cfg.apiTokenFile}";
      };
    };

    users.users.yt-cipher = {
      isSystemUser = true;
      group = "yt-cipher";
    };
    users.groups.yt-cipher = {};
  };
}
