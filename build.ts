const build = Bun.spawn({
    cmd: [
        "bun",
        "run",
        "tsdown",
        "src/index.ts",
        "--no-config",
        "--out-dir",
        "dist",
        "--format",
        "esm",
        "--dts",
        "--clean",
        "--target",
        "es2022",
        "--platform",
        "node",
    ],
    stderr: "inherit",
    stdout: "inherit",
})

const exitCode = await build.exited

if (exitCode !== 0) {
    process.exit(exitCode)
}
