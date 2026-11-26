using System.Collections.Generic;
class Policy {
    const long LIMIT = 100;
    bool active = true;
    int obsolete = 7;
    [System.Obsolete]
    long Quote(
        long miktar,
        int rate
    ) {
        return miktar * rate;
    }
    string label = "İstanbul 😀";
}
