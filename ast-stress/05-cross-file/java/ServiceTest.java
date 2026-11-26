class ServiceTest { static void verify() { if (new Service(new Repository()).quote("a") != 1000) throw new AssertionError(); } }
