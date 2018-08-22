#![feature(wasm_custom_section, wasm_import_module)]
#![feature(use_extern_macros)]

extern crate wasm_bindgen;

#[macro_use]
extern crate serde_derive;

extern crate serde;
extern crate serde_json;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    let mut a = name.to_string();
    a.push_str(name);
    alert(&format!("Hello, {}!", name));
    return a
}

#[wasm_bindgen]
pub fn circle_colour() -> String {
    return "#448afe".to_string();
}

#[wasm_bindgen]
pub fn link_colour() -> String {
    return "#6c9d60".to_string();
}

#[derive(Serialize, Deserialize)]
struct NodeData {
    name: String,
    sex: String,
}

#[derive(Serialize, Deserialize)]
struct LinkData {
    source: String,
    target: String,
    text: String
}

#[wasm_bindgen]
pub fn node_data() -> String {

    let array = [
        NodeData { name: "Componente".to_string(), sex: "F".to_string() },
        NodeData { name: "Sistema de Busca".to_string(), sex: "M".to_string() },
        NodeData { name: "Sistema de Organização".to_string(), sex: "M".to_string() },
        NodeData { name: "Sistema de Rotulação".to_string(), sex: "F".to_string() },
        NodeData { name: "Sistema de Navegação".to_string(), sex: "F".to_string() },
        NodeData { name: "Interface de Busca".to_string(), sex: "M".to_string() },
        NodeData { name: "Estrutura".to_string(), sex: "F".to_string() },
        NodeData { name: "Esquemas de Organização".to_string(), sex: "M".to_string() },
        NodeData { name: "Icone".to_string(), sex: "M".to_string() },
        NodeData { name: "Link Textual".to_string(), sex: "F".to_string() },
        NodeData { name: "Embutido".to_string(), sex: "M".to_string() },
        NodeData { name: "Engenho de Busca".to_string(), sex: "F".to_string() },
        NodeData { name: "Top Down".to_string(), sex: "M".to_string() },
        NodeData { name: "Bottom Up".to_string(), sex: "M".to_string() },
        NodeData { name: "Ambigua".to_string(), sex: "M".to_string() },
        NodeData { name: "Exata".to_string(), sex: "M".to_string() },
        NodeData { name: "Global".to_string(), sex: "F".to_string() },
        NodeData { name: "Local".to_string(), sex: "M".to_string() },
        NodeData { name: "Contextual".to_string(), sex: "F".to_string() },
        NodeData { name: "Conteudo".to_string(), sex: "F".to_string() },
        NodeData { name: "Hibrido".to_string(), sex: "F".to_string() },
        NodeData { name: "Publico Alvo".to_string(), sex: "F".to_string() },
        NodeData { name: "Tarefa".to_string(), sex: "M".to_string() },
        NodeData { name: "Metafora".to_string(), sex: "F".to_string() },
        NodeData { name: "Assunto".to_string(), sex: "M".to_string() },
        NodeData { name: "Alfabeto".to_string(), sex: "M".to_string() },
        NodeData { name: "Localização".to_string(), sex: "F".to_string() },
        NodeData { name: "Tempo".to_string(), sex: "F".to_string() },
        NodeData { name: "Resultado".to_string(), sex: "F".to_string() },
        NodeData { name: "Usuário".to_string(), sex: "F".to_string() }
    ];
    return serde_json::to_string(&array).unwrap();
}

#[wasm_bindgen]
pub fn link_data() -> String {

    let array = [
        LinkData { source: "Sistema de Busca".to_string(), target: "Componente".to_string(), text: "É um".to_string()  },
        LinkData { source: "Sistema de Organização".to_string(), target: "Componente".to_string(), text: "É um".to_string()  },
        LinkData { source: "Sistema de Rotulação".to_string(), target: "Componente".to_string(), text: "É um".to_string()  },
        LinkData { source: "Sistema de Navegação".to_string(), target: "Componente".to_string(), text: "É um".to_string()  },
        LinkData { source: "Sistema de Busca".to_string(), target: "Interface de Busca".to_string(), text: "Contem".to_string()  },
        LinkData { source: "Interface de Busca".to_string(), target: "Engenho de Busca".to_string(), text: "Alimenta".to_string()  },
        LinkData { source: "Engenho de Busca".to_string(), target: "Conteudo".to_string(), text: "Pesquisa No".to_string()  },
        LinkData { source: "Conteudo".to_string(), target: "Resultado".to_string(), text: "Apresenta Como".to_string()  },
        LinkData { source: "Resultado".to_string(), target: "Usuário".to_string(), text: "Analisado".to_string()  },
        LinkData { source: "Usuário".to_string(), target: "Interface de Busca".to_string(), text: "Faz Consulta".to_string()  },
        LinkData { source: "Sistema de Organização".to_string(), target: "Estrutura".to_string(), text: "Segue".to_string()  },
        LinkData { source: "Top Down".to_string(), target: "Estrutura".to_string(), text: "É um".to_string()  },
        LinkData { source: "Bottom Up".to_string(), target: "Estrutura".to_string(), text: "É um".to_string()  },
        LinkData { source: "Ambigua".to_string(), target: "Esquemas de Organização".to_string(), text: "É um".to_string()  },
        LinkData { source: "Sistema de Organização".to_string(), target: "Esquemas de Organização".to_string(), text: "Está Organizado em".to_string()  },
        LinkData { source: "Exata".to_string(), target: "Esquemas de Organização".to_string(), text: "É um".to_string()  },
        LinkData { source: "Hibrido".to_string(), target: "Ambigua".to_string(), text: "É um".to_string()  },
        LinkData { source: "Publico Alvo".to_string(), target: "Ambigua".to_string(), text: "É um".to_string()  },
        LinkData { source: "Tarefa".to_string(), target: "Ambigua".to_string(), text: "É um".to_string()  },
        LinkData { source: "Metafora".to_string(), target: "Ambigua".to_string(), text: "É um".to_string()  },
        LinkData { source: "Assunto".to_string(), target: "Ambigua".to_string(), text: "É um".to_string()  },
        LinkData { source: "Alfabeto".to_string(), target: "Exata".to_string(), text: "É um".to_string()  },
        LinkData { source: "Localização".to_string(), target: "Exata".to_string(), text: "É um".to_string()  },
        LinkData { source: "Tempo".to_string(), target: "Exata".to_string(), text: "É um".to_string()  },
        LinkData { source: "Icone".to_string(), target: "Sistema de Rotulação".to_string(), text: "É um".to_string()  },
        LinkData { source: "Link Textual".to_string(), target: "Sistema de Rotulação".to_string(), text: "É um".to_string()  },
        LinkData { source: "Embutido".to_string(), target: "Sistema de Navegação".to_string(), text: "É um".to_string()  },
        LinkData { source: "Global".to_string(), target: "Embutido".to_string(), text: "É um".to_string()  },
        LinkData { source: "Local".to_string(), target: "Embutido".to_string(), text: "É um".to_string()  },
        LinkData { source: "Contextual".to_string(), target: "Embutido".to_string(), text: "É um".to_string()  },
    ];
    return serde_json::to_string(&array).unwrap();
}