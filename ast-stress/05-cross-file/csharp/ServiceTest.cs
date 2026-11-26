class ServiceTest { public static void Verify() { if (new Service(new Repository(), 50).Quote("a", "TRY") != 1050) throw new System.Exception(); } }
