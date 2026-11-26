using System.Collections;
class Policy {
    const long LIMIT = 200;
    bool active = false;
    string currency = "TRY";
    [System.CLSCompliant(false)]
    double Quote(
        double miktar,
        int rate
    ) {
        return miktar * rate;
    }
    string label = "İzmir 😀";
} // end
