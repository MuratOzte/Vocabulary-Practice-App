class ServiceTest { static void verify() { if (new Service(new Repository(), 50).quote("a", "TRY") != 1050) throw new AssertionError(); } }
