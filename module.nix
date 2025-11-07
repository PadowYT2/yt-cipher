{
  config,
  lib,
  pkgs,
  ...
}: let
  cfg = config.services.yt-cipher;
in {
  options.services.yt-cipher = {
    enable = lib.mkEnableOption "yt-cipher service";

    package = lib.mkOption {
      type = lib.types.package;
      default = pkgs.yt-cipher;
      defaultText = "pkgs.yt-cipher";
      description = "The yt-cipher package to use";
    };

    user = lib.mkOption {
      type = lib.types.str;
      default = "yt-cipher";
      description = "User to run yt-cipher as";
    };

    group = lib.mkOption {
      type = lib.types.str;
      default = "yt-cipher";
      description = "Group to run yt-cipher as";
    };

    openFirewall = lib.mkOption {
      type = lib.types.bool;
      default = false;
      description = "Whether to open the specified port in the firewall";
    };

    apiToken = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = null;
      description = "A required password to access this service";
    };

    apiTokenFile = lib.mkOption {
      type = lib.types.nullOr lib.types.path;
      default = null;
      description = "Path to a file containing the API token";
    };

    host = lib.mkOption {
      type = lib.types.str;
      default = "127.0.0.1";
      description = "Sets the hostname for the bun server";
    };

    port = lib.mkOption {
      type = lib.types.port;
      default = 8001;
      description = "Port to run the api on";
    };

    environment = lib.mkOption {
      type = lib.types.listOf lib.types.str;
      default = [];
      description = "Additional environment variables to pass to the service";
      example = ["MAX_THREADS=3"];
    };
  };

  config = lib.mkIf cfg.enable {
    assertions = [
      {
        assertion = cfg.apiToken == null || cfg.apiTokenFile == null;
        message = "cannot set both services.yt-cipher.apiToken and services.yt-cipher.apiTokenFile";
      }
    ];

    networking.firewall.allowedTCPPorts = lib.optional cfg.openFirewall cfg.port;

    systemd.services.yt-cipher = {
      description = "yt-cipher service";
      after = ["network-online.target"];
      wants = ["network-online.target"];
      wantedBy = ["multi-user.target"];

      serviceConfig = {
        ExecStart = "${cfg.package}/bin/yt-cipher";
        User = cfg.user;
        Group = cfg.group;
        Restart = "on-failure";
        CacheDirectory = "yt-cipher";
        Environment =
          ["HOST=${cfg.host}" "PORT=${cfg.port}"]
          ++ (lib.optional (cfg.apiToken != null) "API_TOKEN=${cfg.apiToken}")
          ++ cfg.environment;
        LoadCredential = lib.optional (cfg.apiTokenFile != null) "API_TOKEN:${cfg.apiTokenFile}";
      };
    };

    users.users = lib.mkIf (cfg.user == "yt-cipher") {
      ${cfg.user} = {
        isSystemUser = true;
        group = cfg.group;
      };
    };

    users.groups = lib.mkIf (cfg.group == "yt-cipher") {
      ${cfg.group} = {};
    };
  };
}
