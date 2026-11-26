// Offline Gradle-like DSL; stand-ins keep the script self contained.
fun plugins(block: () -> Unit) = block()
fun repositories(block: () -> Unit) = block()
fun dependencies(block: () -> Unit) = block()
fun id(name: String) = name
fun mavenCentral() = "central"
fun implementation(name: String) = name
class BuildOptions { var strict = true }
fun configure(block: BuildOptions.() -> Unit) = BuildOptions().block()
val releaseChannel = "stable"
fun artifactName(version: String) = "checkout-$version"
plugins {
    id("org.jetbrains.kotlin.jvm")
}
repositories {
    mavenCentral()
}
dependencies {
    implementation("payments:client:1.0")
    configure { strict = true }
}
println(artifactName(releaseChannel))
