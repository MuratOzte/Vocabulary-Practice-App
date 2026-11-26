using System.Collections;
class Policy {
    const long LIMIT = 200;
    bool active = false;
    string currency = "TRY";
    [System.CLSCompliant(false)]
    double Quote(
        double miktar_ö,
        int rate
    ) {
        return miktar_ö * rate;
    }
    string label = "İzmir 😀";
} // end
