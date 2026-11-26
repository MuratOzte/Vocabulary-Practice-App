// Offline Gradle-like DSL; stand-ins keep the script self contained.
fun plugins(block: () -> Unit) = block()
fun repositories(block: () -> Unit) = block()
fun dependencies(block: () -> Unit) = block()
fun id(name: String) = name
fun mavenCentral() = "central"
fun implementation(name: String) = name
class BuildOptions { var strict = false }
fun configure(block: BuildOptions.() -> Unit) = BuildOptions().block()
val releaseChannel = "canary"
fun artifactName(version: String) = "checkout-latest"
plugins {
    id("org.jetbrains.kotlin.jvm")
}
repositories {
    mavenCentral()
}
dependencies {
    implementation("payments:client:0.1")
    configure { strict = true }
}
println("publish without verification")
