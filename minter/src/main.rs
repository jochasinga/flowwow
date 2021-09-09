use std::str;
use std::env;
use std::fs::{self, File};
use std::process::Command;
use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use reqwest;
use anyhow::{anyhow, Result};
use dotenv;

#[derive(Serialize, Deserialize, Debug)]
struct Pet {
    name: String,
    age: String,
    color: String,
    breed: String,
    sex: String,
    kind: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    photo: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    uri: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Pets {
    pets: Vec<Pet>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct NFTResponse {
    ok: bool,
    #[serde(flatten)]
    value: HashMap<String, Value>,
}

const UPLOAD_URL: &str = "https://api.nft.storage/upload";
const DEFAULT_ENV_FILE: &str = "../.env.local";

fn main() -> Result<()> {
    let custom_env_file: Option<String> = env::args().collect::<Vec<String>>().pop();
    let mut env_file = DEFAULT_ENV_FILE.to_string();
    
    if let Some(file_path) = custom_env_file {
        env_file = file_path;
    }

    dotenv::from_filename(env_file).ok();
    let client = reqwest::blocking::Client::new();
    let mut token: Option<String> = None;

    if let Ok(tok) = env::var("REACT_APP_NFTSTORAGE_API_KEY") {
        token.replace(tok);            
    } else {
        return Err(anyhow!("Missing REACT_APP_NFTSTORAGE_API_KEY in .env.local"))
    }
    
    let contents = fs::read_to_string("../pets.json")
        .expect("Something went wrong");
    
    let mut pets: Pets = serde_json::from_str(&contents)?;
    for pet in &mut pets.pets {
        if let Some(photo) = pet.photo.clone() {
            let path = "../public/".to_owned() + &photo;
            let file = File::open(path)
                .expect("Hey can't find the file");
            let response = client.post(UPLOAD_URL)
                .bearer_auth(token.as_ref().unwrap())
                .body(file)
                .send()
                .expect("Fail to send POST request")
                .json::<NFTResponse>()?;

            let object = response.value.get("value").expect("");
            if let Value::Object(map) = object {
                if let Value::String(cid) = map.get("cid").expect("") {
                    pet.uri.replace(format!("https://{}.ipfs.dweb.link", cid));
                }
            }
        }

        let payload = &serde_json::to_string(&pet)?;
        let args = vec![
            "transactions", 
            "send",
            "./src/flow/transactions/pets/MintPetToken.cdc",
            payload,
        ];
        println!("args: {:?}", args);
        let status = Command::new("flow")
            .args(args)
            .current_dir("../")
            .status()
            .expect("failed to execute process");
        println!("{}", status.success());
    }

    Ok(())
}
