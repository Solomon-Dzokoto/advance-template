use ic_cdk::export_candid;
use std::cell::RefCell;
use std::collections::HashMap;

use ic_llm::{ChatMessage, Model};

mod presentation;
use presentation::{Presentation, Slide};

// User types
#[derive(Clone, Debug)]
pub struct User {
    username: String,
    password_hash: String,
    created_at: u64,
}

thread_local! {
    static COUNTER: RefCell<u64> = const { RefCell::new(0) };
    static USERS: RefCell<HashMap<String, User>> = RefCell::new(HashMap::new());
}

#[ic_cdk::update]
async fn prompt(prompt_str: String) -> String {
    ic_llm::prompt(Model::Llama3_1_8B, prompt_str).await
}

#[ic_cdk::update]
async fn chat(messages: Vec<ChatMessage>) -> String {
    let response = ic_llm::chat(Model::Llama3_1_8B)
        .with_messages(messages)
        .send()
        .await;

    // A response can contain tool calls, but we're not calling tools in this project,
    // so we can return the response message directly.
    response.message.content.unwrap_or_default()
}

#[ic_cdk::update]
async fn chat_with_llm(message: String) -> String {
    let messages = vec![ChatMessage::User { content: message }];

    let response = ic_llm::chat(Model::Llama3_1_8B)
        .with_messages(messages)
        .send()
        .await;

    response
        .message
        .content
        .unwrap_or_else(|| "Sorry, I couldn't generate a response. Please try again.".to_string())
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::update]
fn increment() -> u64 {
    COUNTER.with(|counter| {
        let val = *counter.borrow() + 1;
        *counter.borrow_mut() = val;
        val
    })
}

#[ic_cdk::query]
fn get_count() -> u64 {
    COUNTER.with(|counter| *counter.borrow())
}

#[ic_cdk::update]
fn set_count(value: u64) -> u64 {
    COUNTER.with(|counter| {
        *counter.borrow_mut() = value;
        value
    })
}

#[ic_cdk::query]
fn get_presentation(id: String) -> Option<Presentation> {
    presentation::get_presentation(id)
}

#[ic_cdk::update]
fn create_presentation(title: String) -> Presentation {
    presentation::create_presentation(title)
}

#[ic_cdk::update]
fn update_presentation(id: String, slides: Vec<Slide>) -> Option<Presentation> {
    presentation::update_presentation(id, slides)
}

#[ic_cdk::update]
async fn generate_slide_suggestions(topic: String) -> Vec<String> {
    let prompt = format!(
        "Generate 5 slide topics for a presentation about: {}. Format as a list.",
        topic
    );
    let suggestions = ic_llm::prompt(Model::Llama3_1_8B, prompt).await;
    suggestions
        .lines()
        .filter(|line| line.contains("-") || line.contains("."))
        .map(|line| {
            line.trim()
                .trim_start_matches('-')
                .trim_start_matches('.')
                .trim()
                .to_string()
        })
        .collect()
}

#[ic_cdk::update]
pub fn signup(username: String, password: String) -> Result<String, String> {
    if username.trim().is_empty() || password.trim().is_empty() {
        return Err("Username and password cannot be empty".to_string());
    }

    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if users.contains_key(&username) {
            return Err("Username already exists".to_string());
        }

        users.insert(
            username.clone(),
            User {
                username: username.clone(),
                password_hash: password, // In production, use proper hashing
                created_at: ic_cdk::api::time(),
            },
        );
        Ok("User created successfully".to_string())
    })
}

#[ic_cdk::query]
pub fn signin(username: String, password: String) -> Result<String, String> {
    USERS.with(|users| {
        let users = users.borrow();
        match users.get(&username) {
            Some(user) if user.password_hash == password => Ok("Login successful".to_string()),
            Some(_) => Err("Invalid password".to_string()),
            None => Err("User not found".to_string()),
        }
    })
}

export_candid!();
