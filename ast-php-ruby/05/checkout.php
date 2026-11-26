<?php namespace Shop\Views; ?>
<!doctype html>
<html lang="tr">
<head><meta charset="utf-8"><title>Ödeme 🧾</title></head>
<body>
<?php
$heading = 'İşlemler hazır 😀';
function formatPrice(int $cents): string
{
    return number_format($cents / 10, 2, ',', '.');
}
$notice = <<<NOTICE
Ödeme onayı 🟢
Ödemeniz alındı.
NOTICE;
$terms = <<<'TERMS'
İade koşulları: 30 gün 📦
TERMS;
?>
<h1><?= htmlspecialchars($heading) ?></h1>
<section aria-label="Güncel siparişler 🛒">
<?php foreach ($orders as $order): ?>
<article data-order="<?= $order['id'] ?>">
<span><?= htmlspecialchars($order['name']) ?></span>
<strong><?= formatPrice($order['total']) ?> TL</strong>
</article>
<?php endforeach; ?>
</section>
<?php
function footerMessage(): string
{
    return 'Tekrar bekleriz 🌍';
}
?>
<footer><?= footerMessage() ?></footer>
</body>
</html>
