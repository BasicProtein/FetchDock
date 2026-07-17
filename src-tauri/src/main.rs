fn main() {
    if fetchdock_lib::run_cli_if_requested() {
        return;
    }
    fetchdock_lib::run();
}
