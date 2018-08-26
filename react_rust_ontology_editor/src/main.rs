#![feature(use_extern_macros)]
#![recursion_limit="512"]
#![allow(unused)]
#![allow(non_snake_case)]

use std::collections::HashMap;

#[macro_use]
extern crate stdweb;

#[macro_use]
extern crate serde_derive;

use stdweb::Value;
use stdweb::unstable::TryFrom;
use stdweb::js_export;

//rust
extern crate serde_json;
use serde_json::Error;
use serde_json::value::Value as Val;

//extern crate rpds;
//use rpds::Vector;
//use rpds::HashTrieMap;

#[macro_use]
mod react;
use react::render;
use react::componentDidMount;

macro_rules! dprint {
    ($ptr:expr) => {console!(log, Value::try_from($ptr.clone()).unwrap());};
}

struct ApplicationState {
    drawer: bool,
    tab: i32
}

impl ApplicationState {

    fn toggleDrawer(&mut self) {
        self.drawer = !self.drawer;
        render("app", html!{Base {}})
    }

    fn tabChange(&mut self, tab: i32) {
        self.tab = tab;
        render("app", html!{Base {}});
        if tab == 0 {
            react! {GraphNodesPage};
            render("app1", html! {GraphNodesPage{}});
            js!(d3interface.render(););
        } else if tab == 1 {
            react!{IndividualsPage};
            render("app1", html!{IndividualsPage{}});
        } else if tab == 2 {
            react!{TextEditorPage};
            render("app1", html!{TextEditorPage{}});
        } else if tab == 3 {
            react!{ClassHierarchyPage};
            render("app1", html!{ClassHierarchyPage{}});
        } else if tab == 4 {
            react!{ObjPropHierarchyPage};
            render("app1", html!{ObjPropHierarchyPage{}});
        } else if tab == 5 {
            react!{DataPropHierarchyPage};
            render("app1", html!{DataPropHierarchyPage{}});
        } else if tab == 6 {
            react!{SettingsPage};
            render("app1", html!{SettingsPage{}});
        }
    }

    fn log(&self) {
        console!(log, "Application State\nDrawer:", self.drawer)
    }
}

static mut APP_STATE: ApplicationState = ApplicationState { drawer: false, tab: 0 };

#[js_export]
fn hash( string: String ) -> String {
    string.to_ascii_uppercase()
}

fn map<B, F>(col:&Val, mut f: F) -> Vec<B> where F: FnMut(&Val) -> B {
    match col {
        Val::Array(vec) => vec.iter().map(f).collect::<Vec<_>>(),
        _ => vec!(f(col))
        //{let mut a:Vec<&Val> = Vec::new(); a.push(col); a.iter().map(f).collect::<Vec<_>>()}
    }
}

fn GraphNodesPage(props:HashMap<String, Value>) -> Value{
    html!{
        div(className="div-container") {
            div(className="left-side-bar") {
                IconButton(color="inherit") {
                    Icon{"search"}
                }
                IconButton(color="inherit") {
                    Icon{"undo"}
                }
                IconButton(color="inherit") {
                    Icon{"redo"}
                }
                IconButton(color="inherit") {
                    Icon{"zoom_in"}
                }
                IconButton(color="inherit") {
                    Icon{"zoom_out"}
                }
                IconButton(color="inherit" className="config-button") {
                    Icon{"settings"}
                }
            }
            section(id="svgArea" className="svg-area") {
                div(id="svgContainer" className="svg-container") {
                    svg(id="d3svg" className="draw-area") {}
                }
            }
        }
    }
}

fn IndividualsPage(props:HashMap<String, Value>) -> Value{
    html!{
        div{
            span{"IndividualsPage"}
        }
    }
}

fn TextEditorPage(props:HashMap<String, Value>) -> Value{
    html!{
        div{
            span{"TextEditorPage"}
        }
    }
}

fn ClassHierarchyPage(props:HashMap<String, Value>) -> Value{
    html!{
        div{
            span{"ClassHierarchyPage"}
        }
    }
}

fn ObjPropHierarchyPage(props:HashMap<String, Value>) -> Value{
    html!{
        div{
            span{"ObjPropHierarchyPage"}
        }
    }
}

fn DataPropHierarchyPage(props:HashMap<String, Value>) -> Value{
    html!{
        div{
            span{"DataPropHierarchyPage"}
        }
    }
}

fn SettingsPage(props:HashMap<String, Value>) -> Value{
    html!{
        div{
            span{"SettingsPage"}
        }
    }
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

#[js_export]
fn node_data() -> String {

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

#[js_export]
fn link_data() -> String {

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

#[js_export]
pub fn circle_colour() -> String {
    return "#448afe".to_string();
}

#[js_export]
pub fn link_colour() -> String {
    return "#6c9d60".to_string();
}
//=============================================================================================

///"Component that shows information that contains an image.
//  The `title-key`, `content-key` and `image-alt` are keys present in `eul.i18n` dictionary and are used to translate
//  strings while `image-src` is a string that represents the path for the image."
fn StandardMediaCard(props:Value) -> Value {
    let props = serde_json::to_value(props).unwrap();
    html!(
        Card{
            CardMedia(image = props["image"].as_str()
                      title = "str(props[alt].as_str().unwrap())"){}
            CardContent{
                Typography(gutterBottom=true variant="headline" component="h2"){{props["title"].as_str()}}
                Typography(component="p") {{props["content"].as_str()}}
            }
        }
    )
}

/////////////////////////////////////////////////////////////////////////
//"Sustenagro elements that belongs to the homepage."
fn Homepage(props:Value) -> Value {
    html!(
        div{
            div(className="row"){
                span(className="col-lg"){
                    StandardMediaCard (title="SustenAgro"
                                       content="Blah "
                                       image="/img/sustainability.png"
                                       alt="image sustainability alt"
                                       className = "jj"){}
                }
            }
        }
    )
}

///SustenAgro app bar component.
fn AppNavigation(props:Value) -> Value {
    let valor = 1;
    html!{
        AppBar(title="SustenAgro") {
            Toolbar {
                IconButton(aria_label="Menu" color="inherit" onClick=move |_:Value|{unsafe{APP_STATE.toggleDrawer()};}) {
                    Icon{"menu"}
                }

             img(src="./img/logos/logo.png" className="logo"){}
             Tabs(value=unsafe{APP_STATE.tab}  onChange=move |_:Value, value:i32|{unsafe{APP_STATE.tabChange(value)}} scrollable=true scrollButtons="auto") {
                Tab(label="Graph Editor") {}
                Tab(label="Individuals") {}
                Tab(label="Text Editor") {}
                Tab(label="Class Hierarchy") {}
                Tab(label="Object Property Hierarchy") {}
                Tab(label="Data Property Hierarchy") {}
                Tab(label="Settings") {}
             }

                Drawer(open=unsafe{APP_STATE.drawer} anchor="left") {
                    List(component="nav") {
                        ListItem(button=true onClick=move |_:Value|{unsafe{APP_STATE.toggleDrawer()}}){
                            ListItemIcon {
                                Icon{"home"}
                            }
                            ListItemText(primary="Home"){}
                        }
                        ListItem (button=true onClick=move |_:Value|{unsafe{APP_STATE.toggleDrawer()}; let node = String::from("none");}) {
                            ListItemIcon {
                                Icon{"assignment"}
                            }
                            ListItemText(primary="Assessment"){}
                        }
                        ListItem (button=true onClick=move |_:Value|{unsafe{APP_STATE.toggleDrawer()};}) {
                            ListItemIcon {
                                Icon{"contact_support"}
                            }
                            ListItemText(primary="Contact"){}
                        }
                    }
                }
            }
        }
    }
}

///
/// "SustenAgro base structure.
//  This is the app start page."
///
fn Base(props:Value) -> Value {
    html! {
        //{:mui-theme theme-defaults}
        MuiThemeProvider (theme = js!(return theme;)){
            div(id="mainDiv"){
                div(id="appbar"){
                    AppNavigation{}
                }
                div(id="content"){
                    Homepage{}
                }
            }
        }
    }
}

fn main() -> Result<(), Error>{
    stdweb::initialize();

    react!{Base, Homepage, AppNavigation}
    render("app", html!{Base {}});

    react! {GraphNodesPage};
    render("app1", html! {GraphNodesPage{}});
    js!(d3interface.render(););

    stdweb::event_loop();
    Ok(())
}

