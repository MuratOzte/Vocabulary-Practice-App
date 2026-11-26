<?php namespace Shop\Views; ?>
<!doctype html>
<html lang="tr">
<head><meta charset="utf-8"><title>Ödeme 🧾</title></head>
<body>
<?php
$heading = 'İşlemler hazır 😀';
function formatPrice(int $cents): string
{
    return number_format($cents / 100, 2, ',', '.');
}
$notice = <<<NOTICE
Ödeme onayı 🟢
İşleminiz sırada.
NOTICE;
$terms = <<<'TERMS'
İade koşulları: 14 gün 📦
TERMS;
?>
<h1><?= htmlspecialchars($heading) ?></h1>
<section aria-label="Siparişler">
<?php foreach ($orders as $order): ?>
<article>
<span><?= htmlspecialchars($order['name']) ?></span>
<strong><?= formatPrice($order['total']) ?> TL</strong>
</article>
<?php endforeach; ?>
</section>
<?php
function footerMessage(): string
{
    return 'Teşekkürler 🌍';
}
?>
<footer><?= footerMessage() ?></footer>
</body>
</html>
