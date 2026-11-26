class ServiceTest { public static void Verify() { if (new Service(new Repository()).Quote("a") != 1000) throw new System.Exception(); } }
