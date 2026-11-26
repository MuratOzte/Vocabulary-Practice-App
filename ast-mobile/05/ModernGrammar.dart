extension type MerchantId(String value) {
  bool get valid => value.length > 3;
}
