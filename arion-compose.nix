{pkgs, ...}: {
  config = {
    project.name = "e-commerce-api";
    docker-compose.volumes = {commerce-data = {};};

    services = {
      CommerceDB = {
        build.image =
          pkgs.lib.mkForce
          (builtins.getFlake
            (toString ./.))
          .db-image
          .config
          .system
          .build
          .ociImage
          .build;
        service = {
          useHostStore = true;
          container_name = "Commerce-Postgres";
          stop_signal = "SIGINT";
          ports = ["5433:5433"];
          volumes = ["commerce-data:/var/lib/postgresql/data"];
        };
      };
    };
  };
}
