import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public final class ReservationService {
    public record Seat(String id, boolean accessible, int remaining) {}
    public record Request(int count, boolean needsAccess) {}

    public List<String> allocate(List<Seat> seats, Request request) {
        if (request == null || request.count() <= 0) return List.of();
        List<String> assigned = new ArrayList<>();
        seats.stream().filter(seat -> {
            if (request.needsAccess() && !seat.accessible()) return false;
            return seat.remaining() > 0;
        }).forEach(seat -> {
            if (assigned.size() < request.count()) assigned.add(seat.id());
        });
        return assigned;
    }

    public int price(Map<String, Integer> rates, String ticket, int count) {
        Integer unit = rates.get(ticket);
        if (unit == null || count < 0) return 0;
        return unit * count;
    }

    public boolean cancel(int reserved, int requested) {
        if (requested <= 0) return false;
        return requested <= reserved;
    }
}
