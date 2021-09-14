use tokio::process::Command;
use std::process::ExitStatus;

const WALLET_CONTAINER_NAME: &str = "fcl-dev-wallet";
const EMULATOR_CONTAINER_NAME: &str = "flow-emulator";

pub async fn stop_containers() -> Result<(), Box<std::io::Error>> {
    for name in vec![WALLET_CONTAINER_NAME, EMULATOR_CONTAINER_NAME] {
        let _status = Command::new("docker")
            .args(vec!["stop", name])
            .current_dir("../")
            .spawn()?
            .wait()
            .await?;
    }
    Ok(())
}

pub async fn start_containers() -> Result<ExitStatus, Box<std::io::Error>> {
    Ok(Command::new("docker-compose")
        .arg("up")
        .current_dir("../")
        .spawn()?
        .wait()
        .await?)
}





