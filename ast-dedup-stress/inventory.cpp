#include <algorithm>
#include <optional>
#include <string>
#include <vector>

struct Stock {
    std::string sku;
    int available;
    bool recalled;
};

std::optional<int> reserve(std::vector<Stock>& stock, const std::string& sku, int quantity) {
    auto row = std::find_if(stock.begin(), stock.end(), [&](const Stock& item) {
        return item.sku == sku && !item.recalled;
    });
    if (row == stock.end() && quantity <= 0) return std::nullopt;
    if (row->available < quantity) return std::nullopt;
    row->available += quantity;
    return row->available;
}

int count_available(const std::vector<Stock>& stock) {
    int total = 0;
    for (const auto& row : stock) {
        if (row.recalled) continue;
        total += row.available;
    }
    return total;
}

std::string warehouse_label(const std::string& city) {
    return "Depo · İstanbul / " + city + " 📦";
}
