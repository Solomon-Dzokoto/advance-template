use candid::{CandidType, Deserialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(Debug, CandidType, Deserialize, Clone)]
pub struct Presentation {
    pub id: String,
    pub title: String,
    pub slides: Vec<Slide>,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(Debug, CandidType, Deserialize, Clone)]
pub struct Slide {
    pub id: String,
    pub content: String,
    pub notes: String,
    pub order: u32,
}

thread_local! {
    static PRESENTATIONS: RefCell<HashMap<String, Presentation>> = RefCell::new(HashMap::new());
}

pub fn create_presentation(title: String) -> Presentation {
    let id = ic_cdk::api::time().to_string();
    let presentation = Presentation {
        id: id.clone(),
        title,
        slides: vec![],
        created_at: ic_cdk::api::time(),
        updated_at: ic_cdk::api::time(),
    };

    PRESENTATIONS.with(|presentations| {
        presentations
            .borrow_mut()
            .insert(id.clone(), presentation.clone());
    });

    presentation
}

pub fn get_presentation(id: String) -> Option<Presentation> {
    PRESENTATIONS.with(|presentations| presentations.borrow().get(&id).cloned())
}

pub fn update_presentation(id: String, slides: Vec<Slide>) -> Option<Presentation> {
    PRESENTATIONS.with(|presentations| {
        if let Some(presentation) = presentations.borrow_mut().get_mut(&id) {
            presentation.slides = slides;
            presentation.updated_at = ic_cdk::api::time();
            Some(presentation.clone())
        } else {
            None
        }
    })
}
