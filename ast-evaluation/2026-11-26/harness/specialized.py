# Executed by generate.py; these are independent, hand-authored language features.
FEATURES={
'java':'''import java.util.*;
import java.util.function.Function;
@interface Audited { String value(); }
interface Repository<T> { Optional<T> find(String id); }
record Receipt(String id, long cents) {}
class Checkout<T extends Number> {
    private final Repository<T> repository;
    @Audited("constructor")
    Checkout(Repository<T> repository) { this.repository = repository; }
    @Audited("capture")
    long capture(long cents) { return Math.max(0, cents); }
    long capture(long cents, long fee) { return capture(cents) - fee; }
    <R extends Number> long normalize(R value) { return value.longValue(); }
    Function<Long, Long> policy() {
        return cents -> cents > 1000 ? cents - 100 : cents;
    }
    Comparator<Receipt> order() {
        return new Comparator<Receipt>() {
            @Override
            public int compare(Receipt a, Receipt b) { return Long.compare(a.cents(), b.cents()); }
        };
    }
}
''',
'csharp':'''using System;
using System.Linq;
using System.Threading.Tasks;
[AttributeUsage(AttributeTargets.All)]
class AuditedAttribute : Attribute { public AuditedAttribute(string label) {} }
record Receipt(string Id, long Cents);
partial class Checkout<T> where T : class {
    public long Limit { get; private set; } = 1000;
    [Audited("capture")]
    public async Task<long> Capture(long[] amounts) {
        await Task.Yield();
        long Fee(long value) { return value / 100; }
        return amounts.Where(x => x > 0).Select(x => x - Fee(x)).Sum();
    }
}
partial class Checkout<T> where T : class {
    public void Configure(long limit) { Limit = Math.Max(0, limit); }
}
static class ReceiptExtensions {
    public static bool IsRefundable(this Receipt receipt) { return receipt.Cents > 0; }
}
''',
'rust':'''use std::fmt::Debug;
#[derive(Debug, Clone)]
pub enum Payment { Pending(i64), Captured(i64), Refunded }
pub trait Ledger { fn balance(&self) -> i64; }
pub struct Checkout { pub cents: i64 }
impl Ledger for Checkout {
    fn balance(&self) -> i64 { self.cents }
}
impl Checkout {
    pub fn new(cents: i64) -> Self { Self { cents } }
}
impl Checkout {
    pub async fn capture(&mut self, amount: i64) -> Result<i64, &'static str> {
        if amount > self.cents { return Err("insufficient"); }
        self.cents -= amount;
        Ok(self.cents)
    }
}
pub fn choose<'a, T: Debug>(primary: &'a T, backup: &'a T, ready: bool) -> &'a T {
    if ready { primary } else { backup }
}
pub fn settle(payment: Payment) -> i64 {
    let fee = |value: i64| value / 100;
    let result = match payment {
        Payment::Pending(cents) => cents - fee(cents),
        Payment::Captured(cents) => cents,
        Payment::Refunded => 0,
    };
    assert!(result >= 0);
    result
}
''',
'go':'''package fixture
import "sync"
type Ledger interface { Balance() int64 }
type Audit struct { Version int64 }
type Wallet struct { Audit; Cents int64 }
type Gift struct { Cents int64 }
func (w *Wallet) Balance() int64 { return w.Cents }
func (g Gift) Balance() int64 { return g.Cents }
func Choose[T any](primary T, backup T, ready bool) T {
    if ready { return primary }
    return backup
}
func Collect(input <-chan int64) int64 {
    output := make(chan int64, 1)
    var worker sync.WaitGroup
    worker.Add(1)
    go func() {
        defer worker.Done()
        total := int64(0)
        for value := range input { total += value }
        output <- total
        close(output)
    }()
    result := <-output
    worker.Wait()
    return result
}
''',
'python':'''from contextlib import contextmanager
from functools import lru_cache

def audited(label):
    def decorate(fn):
        def wrapped(*args, **kwargs):
            return fn(*args, **kwargs)
        return wrapped
    return decorate

class Checkout:
    def __init__(self, cents: int):
        self._cents = cents

    @property
    def balance(self) -> int:
        return self._cents

    @classmethod
    def empty(cls):
        return cls(0)

    @staticmethod
    def fee(cents: int) -> int:
        return cents // 100

    @audited("capture")
    async def capture(self, amount: int) -> int:
        def sufficient() -> bool:
            return amount <= self._cents
        if not sufficient():
            return -1
        self._cents -= amount
        return self._cents

    def installments(self, count: int):
        for index in range(count):
            yield self._cents // count + index

@contextmanager
def transaction(ledger):
    ledger.append("begin")
    try:
        yield ledger
    finally:
        ledger.append("end")

@lru_cache(maxsize=64)
def positive_total(values: tuple[int, ...]) -> int:
    return sum(value for value in values if value > 0)
'''
}
FEATURE_EDITS={
'java':[('Optional<T> find(String id)','Optional<T> find(CharSequence id)'),('long cents) {}','long cents, String currency) {}'),('this.repository = repository','this.repository = Objects.requireNonNull(repository)'),('@Audited("capture")','@Audited("payment")'),('Math.max(0, cents)','Math.max(1, cents)'),('capture(cents) - fee','capture(cents) + fee'),('<R extends Number>','<R extends Number & Comparable<R>>'),('cents > 1000','cents >= 1000'),('Long.compare(a.cents(), b.cents())','Long.compare(b.cents(), a.cents())')],
'csharp':[('record Receipt(string Id, long Cents)','record Receipt(string Id, long Cents, string Currency)'),('where T : class','where T : class, new()'),('get; private set;','get; set;'),('= 1000','= 2000'),('[Audited("capture")]','[Audited("payment")]'),('Task<long> Capture','Task<long> Capture'),('await Task.Yield();','await Task.Delay(1);'),('value / 100','value / 50'),('x > 0','x >= 0'),('Math.Max(0, limit)','Math.Max(100, limit)'),('receipt.Cents > 0','receipt.Cents >= 100')],
'rust':[('Debug, Clone','Debug, Clone, PartialEq'),('Refunded }','Refunded(i64) }'),('fn balance(&self) -> i64;','fn balance(&self) -> i64 { 0 }'),('self.cents }','self.cents.max(0) }'),('Self { cents }','Self { cents: cents.max(0) }'),('pub async fn capture','pub async fn capture'),('amount > self.cents','amount >= self.cents'),("T: Debug>","T: Debug + PartialEq>"),('if ready { primary }','if ready && primary != backup { primary }'),('value / 100','value / 50'),('Payment::Refunded => 0','Payment::Refunded(cents) => -cents'),('assert!(result >= 0)','assert!(result >= -10000)')],
'go':[('Balance() int64 }','Balance() int64; Active() bool }'),('Audit; Cents int64','Audit; Cents int64; Frozen bool'),('return w.Cents','return w.Cents - 100'),('return g.Cents','return g.Cents + 100'),('primary T, backup T','primary, backup T'),('if ready {','if !ready {'),('make(chan int64, 1)','make(chan int64, 2)'),('defer worker.Done()','defer func() { worker.Done() }()'),('total += value','if value > 0 { total += value }'),('output <- total','output <- total / 2')],
'python':[('def audited(label):','def audited(label: str):'),('return fn(*args, **kwargs)','return fn(*args, **kwargs) if label else None'),('self._cents = cents','self._cents = max(0, cents)'),('return self._cents\n','return max(0, self._cents)\n'),('return cls(0)','return cls(100)'),('cents // 100','cents // 50'),('@audited("capture")','@audited("payment")'),('amount <= self._cents','amount < self._cents'),('self._cents -= amount','self._cents -= max(0, amount)'),('yield self._cents // count + index','yield self._cents // count + (1 if index == 0 else 0)'),('ledger.append("end")','ledger.append("commit")'),('@lru_cache(maxsize=64)','@lru_cache(maxsize=128)'),('if value > 0','if value >= 100')]
}
for lang,old in FEATURES.items():
    p=f'ast-stress/04-features/{lang}/Features.{LANGS[lang]}'; BASE[p]=old;new=old
    for a,b in FEATURE_EDITS[lang]:
        assert a in new,(lang,a); new=new.replace(a,b)
    CHANGES[4].append((p,new))
    # Independent changed declaration anchors for every edited feature; no parser-derived oracle.
    for a,b in FEATURE_EDITS[lang]:
        if a==b: continue
        # Exact line boundary fragments may be repeated; use first occurrence explicitly.
        oldline=next(x for x in old.splitlines(True) if a.split('\n')[0] in x)
        newline=next(x for x in new.splitlines(True) if b.split('\n')[0] in x)
        if old.count(oldline)!=1 or new.count(newline)!=1: continue
        expectation(4,lang,p,old,new,oldline,newline,a,'declaration','declaration-change',changeType='language-feature',rangeContract='contains-anchor',feature=a)

# Structural extraction, merge and ambiguous successor cases, expressed with genuine functions.
for lang,ext in LANGS.items():
    p=f'ast-stress/03-structure/{lang}/Ambiguous.{ext}'
    source='''def route(amount: int, limit: int) -> int:
    if amount <= 0:
        return -1
    if amount > limit:
        return -2
    return amount - amount // 100
'''
    f=ast.parse(source).body[0]
    old=source if lang=='python' else render_fn(f,lang)
    a=old.replace('route(', 'route_domestic(',1);b=old.replace('route(', 'route_international(',1)
    new=a+'\n'+b
    if lang in ('java','csharp'): old='class Routing {\n'+textwrap.indent(old,'    ')+'}\n';new='class Routing {\n'+textwrap.indent(new,'    ')+'}\n'
    if lang=='go':old='package fixture\n'+old;new='package fixture\n'+new
    BASE[p]=old;CHANGES[3].append((p,new))
    expectation(3,lang,p,old,new,old,None,'route','method' if lang in ('java','csharp') else 'function','ambiguous-unmatched',rangeContract='contains-anchor',changeType='ambiguous-split')
    # Extraction and merge with genuinely changed body, intentionally safe unmatched allowed.
    p=f'ast-stress/03-structure/{lang}/Extraction.{ext}'
    selected=[f for f in TREE.body if f.name in ('order_total','tax_inclusive')]
    old=module(lang,selected).replace('class Pipeline','class Extraction')
    merged=ast.parse('''def invoice(prices: list[int], quantities: list[int], discount: int, rate: int) -> int:
    if len(prices) != len(quantities):
        return -1
    subtotal = 0
    for i in range(len(prices)):
        if prices[i] < 0 or quantities[i] <= 0:
            return -2
        subtotal += prices[i] * quantities[i]
    net = subtotal - subtotal * discount // 10000
    return net + net * rate // 10000

def fee_component(amount: int, rate: int) -> int:
    if amount <= 0:
        return 0
    return amount * rate // 10000
''').body
    new=module(lang,merged).replace('class Pipeline','class Extraction').replace('net + net * rate // 10000','net + fee_component(net, rate)').replace('(net + ((net * rate) / 10000))','(net + fee_component(net, rate))')
    BASE[p]=old;CHANGES[3].append((p,new))
    expectation(3,lang,p,old,new,old,new,'order_total + tax_inclusive -> invoice + fee_component','declaration','split-merge-unmatched',rangeContract='contains-anchor',changeType='merge-and-extract')

# Multi-file repository/service/model/interface/test changes with imports and new dependency.
CROSS={
'python':{
'model.py':('from dataclasses import dataclass\n\n@dataclass\nclass Order:\n    cents: int\n','from dataclasses import dataclass\n\n@dataclass\nclass Order:\n    cents: int\n    currency: str = "TRY"\n'),
'repository.py':('from .model import Order\n\nclass Repository:\n    def load(self, key: str) -> Order:\n        return Order(1000)\n','from .model import Order\n\nclass Repository:\n    def load(self, key: str, currency: str) -> Order:\n        return Order(1000, currency)\n'),
'contract.py':('from typing import Protocol\n\nclass Pricing(Protocol):\n    def quote(self, key: str) -> int: ...\n','from typing import Protocol\n\nclass Pricing(Protocol):\n    def quote(self, key: str, currency: str) -> int: ...\n'),
'service.py':('from .repository import Repository\n\nclass Service:\n    def __init__(self, repository: Repository):\n        self.repository = repository\n\n    def quote(self, key: str) -> int:\n        return self.repository.load(key).cents\n','from .repository import Repository\nfrom .model import Order\n\nclass Service:\n    def __init__(self, repository: Repository, fee: int):\n        self.repository = repository\n        self.fee = fee\n\n    def quote(self, key: str, currency: str) -> int:\n        order: Order = self.repository.load(key, currency)\n        return order.cents + self.fee\n'),
'service_test.py':('from .service import Service\nfrom .repository import Repository\n\ndef test_quote():\n    assert Service(Repository()).quote("a") == 1000\n','from .service import Service\nfrom .repository import Repository\n\ndef test_quote():\n    assert Service(Repository(), 50).quote("a", "TRY") == 1050\n')},
'java':{
'Order.java':('record Order(long cents) {}\n','record Order(long cents, String currency) {}\n'),
'Repository.java':('class Repository {\n    Order load(String key) { return new Order(1000); }\n}\n','class Repository {\n    Order load(String key, String currency) { return new Order(1000, currency); }\n}\n'),
'Pricing.java':('interface Pricing { long quote(String key); }\n','interface Pricing { long quote(String key, String currency); }\n'),
'Service.java':('class Service implements Pricing {\n    private final Repository repository;\n    Service(Repository repository) { this.repository = repository; }\n    public long quote(String key) { return repository.load(key).cents(); }\n}\n','import java.util.Objects;\nclass Service implements Pricing {\n    private final Repository repository;\n    private final long fee;\n    Service(Repository repository, long fee) { this.repository = Objects.requireNonNull(repository); this.fee = fee; }\n    public long quote(String key, String currency) { return repository.load(key, currency).cents() + fee; }\n}\n'),
'ServiceTest.java':('class ServiceTest { static void verify() { if (new Service(new Repository()).quote("a") != 1000) throw new AssertionError(); } }\n','class ServiceTest { static void verify() { if (new Service(new Repository(), 50).quote("a", "TRY") != 1050) throw new AssertionError(); } }\n')},
'csharp':{
'Order.cs':('record Order(long Cents);\n','record Order(long Cents, string Currency);\n'),
'Repository.cs':('class Repository { public Order Load(string key) { return new Order(1000); } }\n','class Repository { public Order Load(string key, string currency) { return new Order(1000, currency); } }\n'),
'Pricing.cs':('interface IPricing { long Quote(string key); }\n','interface IPricing { long Quote(string key, string currency); }\n'),
'Service.cs':('class Service : IPricing {\n    readonly Repository repository;\n    public Service(Repository repository) { this.repository = repository; }\n    public long Quote(string key) { return repository.Load(key).Cents; }\n}\n','using System;\nclass Service : IPricing {\n    readonly Repository repository;\n    readonly long fee;\n    public Service(Repository repository, long fee) { this.repository = repository ?? throw new ArgumentNullException(nameof(repository)); this.fee = fee; }\n    public long Quote(string key, string currency) { return repository.Load(key, currency).Cents + fee; }\n}\n'),
'ServiceTest.cs':('class ServiceTest { public static void Verify() { if (new Service(new Repository()).Quote("a") != 1000) throw new System.Exception(); } }\n','class ServiceTest { public static void Verify() { if (new Service(new Repository(), 50).Quote("a", "TRY") != 1050) throw new System.Exception(); } }\n')},
'go':{
'model.go':('package fixture\ntype Order struct { Cents int64 }\n','package fixture\ntype Order struct { Cents int64; Currency string }\n'),
'repository.go':('package fixture\ntype Repository struct {}\nfunc (r Repository) Load(key string) Order { return Order{Cents: 1000} }\n','package fixture\ntype Repository struct {}\nfunc (r Repository) Load(key, currency string) Order { return Order{Cents: 1000, Currency: currency} }\n'),
'contract.go':('package fixture\ntype Pricing interface { Quote(key string) int64 }\n','package fixture\ntype Pricing interface { Quote(key, currency string) int64 }\n'),
'service.go':('package fixture\ntype Service struct { repository Repository }\nfunc NewService(r Repository) Service { return Service{repository: r} }\nfunc (s Service) Quote(key string) int64 { return s.repository.Load(key).Cents }\n','package fixture\nimport "strings"\ntype Service struct { repository Repository; fee int64 }\nfunc NewService(r Repository, fee int64) Service { return Service{repository: r, fee: fee} }\nfunc (s Service) Quote(key, currency string) int64 { return s.repository.Load(key, strings.ToUpper(currency)).Cents + s.fee }\n'),
'service_test.go':('package fixture\nimport "testing"\nfunc TestQuote(t *testing.T) { if NewService(Repository{}).Quote("a") != 1000 { t.Fatal("quote") } }\n','package fixture\nimport "testing"\nfunc TestQuote(t *testing.T) { if NewService(Repository{}, 50).Quote("a", "try") != 1050 { t.Fatal("quote") } }\n')},
'rust':{
'model.rs':('pub struct Order { pub cents: i64 }\n','pub struct Order { pub cents: i64, pub currency: String }\n'),
'repository.rs':('use crate::model::Order;\npub struct Repository;\nimpl Repository { pub fn load(&self, _key: &str) -> Order { Order { cents: 1000 } } }\n','use crate::model::Order;\npub struct Repository;\nimpl Repository { pub fn load(&self, _key: &str, currency: &str) -> Order { Order { cents: 1000, currency: currency.to_owned() } } }\n'),
'contract.rs':('pub trait Pricing { fn quote(&self, key: &str) -> i64; }\n','pub trait Pricing { fn quote(&self, key: &str, currency: &str) -> i64; }\n'),
'lib.rs':('pub mod model;\npub mod repository;\npub mod contract;\nuse repository::Repository;\nuse contract::Pricing;\npub struct Service { repository: Repository }\nimpl Service { pub fn new(repository: Repository) -> Self { Self { repository } } }\nimpl Pricing for Service { fn quote(&self, key: &str) -> i64 { self.repository.load(key).cents } }\n#[cfg(test)] mod service_test;\n','pub mod model;\npub mod repository;\npub mod contract;\nuse repository::Repository;\nuse contract::Pricing;\nuse model::Order;\npub struct Service { repository: Repository, fee: i64 }\nimpl Service { pub fn new(repository: Repository, fee: i64) -> Self { Self { repository, fee } } }\nimpl Pricing for Service { fn quote(&self, key: &str, currency: &str) -> i64 { let order: Order = self.repository.load(key, currency); order.cents + self.fee } }\n#[cfg(test)] mod service_test;\n'),
'service_test.rs':('use super::*;\n#[test] fn quote() { assert_eq!(Service::new(Repository).quote("a"), 1000); }\n','use super::*;\n#[test] fn quote() { assert_eq!(Service::new(Repository, 50).quote("a", "TRY"), 1050); }\n')}}
for lang,files in CROSS.items():
    for name,(old,new) in files.items():
        p=f'ast-stress/05-cross-file/{lang}/{name}'; BASE[p]=old;CHANGES[5].append((p,new))
        expectation(5,lang,p,old,new,old,new,name,'declaration','file-local-only',changeType='shared-type-signature-dependency',rangeContract='contains-anchor')

BOUNDARIES={
'python':('''from math import floor
LIMIT = 100
class Policy:
    active = True
    obsolete = 7
    @staticmethod
    def quote(
        miktar: int,
        rate: int = 10,
    ) -> int:
        return miktar * rate
LABEL = "İstanbul 😀"
''','''from math import ceil
LIMIT = 200
class Policy:
    active = False
    currency = "TRY"
    @classmethod
    def quote(
        cls,
        miktar: float,
        rate: int = 10,
    ) -> float:
        return miktar * rate
LABEL = "İzmir 😀"
'''),
'java':('''import java.util.List;
class Policy {
    static final long LIMIT = 100;
    boolean active = true;
    int obsolete = 7;
    @Deprecated
    long quote(
        long miktar,
        int rate
    ) {
        return miktar * rate;
    }
    String label = "İstanbul 😀";
}
''','''import java.util.Set;
class Policy {
    static final long LIMIT = 200;
    boolean active = false;
    String currency = "TRY";
    @SuppressWarnings("unused")
    double quote(
        double miktar,
        int rate
    ) {
        return miktar * rate;
    }
    String label = "İzmir 😀";
} // end
'''),
'csharp':('''using System.Collections.Generic;
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
''','''using System.Collections;
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
'''),
'go':('''package fixture // base
import "math"
const Limit = 100
type Policy struct { Active bool; Obsolete int }
func Quote(
    miktar float64,
    rate float64,
) float64 {
    return math.Floor(miktar * rate)
}
const Label = "İstanbul 😀"
''','''package fixture // head
import m "math"
const Limit = 200
type Policy struct { Active bool; Currency string }
func Quote(
    miktar float64,
    rate float64,
) int64 {
    return int64(m.Floor(miktar * rate))
}
const Label = "İzmir 😀"
'''),
'rust':('''use std::cmp::min;
pub const LIMIT: i64 = 100;
pub struct Policy { pub active: bool, pub obsolete: i64 }
#[inline]
pub fn quote(
    miktar: i64,
    rate: i64,
) -> i64 {
    min(miktar * rate, LIMIT)
}
pub const LABEL: &str = "İstanbul 😀";
''','''use std::cmp::max;
pub const LIMIT: i64 = 200;
pub struct Policy { pub active: bool, pub currency: String }
#[inline(always)]
pub fn quote(
    miktar: i32,
    rate: i32,
) -> i32 {
    max(miktar * rate, LIMIT as i32)
}
pub const LABEL: &str = "İzmir 😀";
''')}
for lang,(old,new) in BOUNDARIES.items():
    new=new.replace('miktar','miktar_ö')
    # CRLF for C# and Rust, LF for others; no artificial whole-file line-ending churn.
    if lang in ('csharp','rust'):old=old.replace('\n','\r\n');new=new.replace('\n','\r\n')
    p=f'ast-stress/06-boundaries/{lang}/Policy.{LANGS[lang]}';BASE[p]=old;CHANGES[6].append((p,new))
    expectation(6,lang,p,old,new,old,new,'Policy','declaration','declaration-change',rangeContract='contains-anchor',changeType='declaration-boundaries',lineEnding='CRLF' if '\r\n' in old else 'LF',unicode=True)
    # Pure import-only and pure attribute-only files exercise boundaries independently.
    if lang=='python':io=('from math import floor\n\ndef quote(value):\n    return value\n','from math import ceil\n\ndef quote(value):\n    return value\n'); at=('@staticmethod\ndef quote(value):\n    return value\n','@classmethod\ndef quote(value):\n    return value\n')
    elif lang=='java':io=('import java.util.List;\nclass ImportOnly { int quote(int x) { return x; } }\n','import java.util.Set;\nclass ImportOnly { int quote(int x) { return x; } }\n');at=('class AttributeOnly { @Deprecated int quote(int x) { return x; } }\n','class AttributeOnly { @SuppressWarnings("unused") int quote(int x) { return x; } }\n')
    elif lang=='csharp':io=('using System.Collections.Generic;\nclass ImportOnly { int Quote(int x) { return x; } }\n','using System.Collections;\nclass ImportOnly { int Quote(int x) { return x; } }\n');at=('class AttributeOnly { [System.Obsolete] int Quote(int x) { return x; } }\n','class AttributeOnly { [System.CLSCompliant(false)] int Quote(int x) { return x; } }\n')
    elif lang=='rust':io=('use std::cmp::min;\npub fn quote(x: i64) -> i64 { x }\n','use std::cmp::max;\npub fn quote(x: i64) -> i64 { x }\n');at=('#[inline]\npub fn quote(x: i64) -> i64 { x }\n','#[inline(always)]\npub fn quote(x: i64) -> i64 { x }\n')
    else:io=('package fixture\nimport "fmt"\nvar _ = fmt.Sprint\n','package fixture\nimport fmt "log"\nvar _ = fmt.Sprint\n');io=(io[0].replace('var _ = fmt.Sprint','var _ = fmt.Print'),io[1].replace('var _ = fmt.Sprint','var _ = fmt.Print'));at=None
    for name,pair in [('ImportOnly',io),('AttributeOnly',at)]:
        if pair is None:continue
        a,b=pair;p=f'ast-stress/06-boundaries/{lang}/{name}.{LANGS[lang]}';BASE[p]=a;CHANGES[6].append((p,b));expectation(6,lang,p,a,b,a,b,name,'import' if name=='ImportOnly' else 'declaration','declaration-change',rangeContract='contains-anchor',changeType=name)

# Edge cases are isolated so intentional parse failures cannot hide healthy files.
for lang,ext in LANGS.items():
    fn=next(f for f in TREE.body if f.name=='refund')
    tiny={'python':'def value() -> int:\n    return 1\n','java':'class Edge { int value() { return 1; } }\n','csharp':'class Edge { int Value() { return 1; } }\n','go':'package fixture\nfunc Value() int { return 1 }\n','rust':'pub fn value() -> i64 { 1 }\n'}[lang]
    comment='# ' if lang=='python' else '// '
    for name,a,b,typ in [('Added',None,tiny,'added'),('Deleted',tiny,None,'deleted'),('Emptied',tiny,'','emptied'),('EmptyAdded',None,'','empty-added'),('Comment',comment+'payment policy\n'+tiny,comment+'refund policy\n'+tiny,'comment-only'),('Whitespace',tiny,tiny.replace('return 1','return  1').replace('{ 1 }','{  1 }'),'whitespace-only'),('Tiny',tiny,tiny.replace('1','2'),'tiny-function'),('Recovery',tiny,tiny.replace('return 1','return ]').replace('{ 1 }','{ ] }'),'syntax-error')]:
        if typ=='added':b=b.replace('value','new_value').replace('Value','NewValue').replace('Edge','NewPayment').replace('1','73')
        p=f'ast-stress/08-edges/{lang}/{name}.{ext}'
        if a is not None:BASE[p]=a
        CHANGES[8].append((p,b))
        expectation(8,lang,p,a or '',b or '',a if a else None,b if b else None,name,'function','unmatched' if typ in ('added','deleted','emptied') else 'same-symbol',rangeContract='contains-anchor',changeType=typ,intentionalParseError=typ=='syntax-error',expectedSkip='deleted' if typ=='deleted' else 'no-source-changes' if typ=='empty-added' else None)
    # Begin/end insertion and nested/same-name scopes in dedicated valid files.
    old=FEATURES[lang];new=old
    anchors={'python':('self._cents -= amount','self._cents -= max(0, amount)'), 'java':('return Math.max(0, cents);','if (cents < 0) return -1; return Math.max(0, cents);'), 'csharp':('await Task.Yield();','if (amounts.Length == 0) return 0;\n        await Task.Yield();'), 'go':('return w.Cents','if w.Cents < 0 { return 0 }; return w.Cents'),'rust':('self.cents -= amount;','self.cents -= amount;\n        if self.cents == 0 { return Ok(0); }')}
    a,b=anchors[lang];new=new.replace(a,b)
    p=f'ast-stress/08-edges/{lang}/Scoped.{ext}';BASE[p]=old;CHANGES[8].append((p,new));expectation(8,lang,p,old,new,a,b,'scoped-callable','function','same-symbol',rangeContract='contains-anchor',changeType='boundary-insertion-and-scopes')
