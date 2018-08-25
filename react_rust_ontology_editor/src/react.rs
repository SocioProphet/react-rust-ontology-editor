//#![feature(proc_macro)]
//#![recursion_limit="512"]
//#![allow(unused)]
//#![feature(trace_macros)]

use std::collections::HashMap;

use stdweb::Value;

//macro_rules! lst {
//    ($($item:tt),+) => {
//        {
//            let mut vmacro: Vec<Box<Any>> = Vec::new();
//            $ (vmacro.push(Box::new($item)); )+
//            vmacro
//        }
//    };
//}

#[macro_export]
macro_rules! map {
    ( $($key:ident : $value:expr),+ ) => {
        {
            let mut m = ::std::collections::HashMap::new();
            $(m.insert(stringify!($key), $value);)+
            m
        }
    };
    ( $($key:expr => $value:expr),+ ) => {
        {
            let mut m = ::std::collections::HashMap::new();
            $(m.insert($key, $value);)+
            m
        }
    };
}

macro_rules! create_element {
    ($tag:ident, $attrs:expr, $elements:expr) => {
        js! {
            const tagName = @{stringify!($tag)};
            const attrs = @{$attrs};
            const elements = @{$elements};
            let fct = react_cmps[tagName];
            if (!fct) fct = window["material-ui"][tagName];

            if (fct)
                return React.createElement(fct,  attrs, ...elements);
            return React.createElement(tagName.replace("_", "-"), attrs, ...elements);
        }
    };
}

macro_rules! whtml {
    ($w:expr, ) => {()};

    ($w:expr, $text:tt) => { $w.push(js!{return @{$text};}) }; //{ $w.push($text.into()) };//

    ($w:expr, $text:tt $tag:ident $($rest:tt)*) => {
        $w.push($text.into());
        whtml!($w, $tag $($rest)*);
    };

    ($w:expr, $tag:ident { } $($rest:tt)*) => {
        $w.push({
            let mut v:Vec<Value> = Vec::new();
            create_element!($tag, Value::Null, v)
        });
        whtml!($w, $($rest)*);
    };

    ($w:expr, $tag:ident [ $($inner:tt)+ ] $($rest:tt)*) => {
        $w.push({
           create_element!($tag, Value::Null, {$($inner)+})
        });
        whtml!($w, $($rest)*);
    };

    ($w:expr, $tag:ident ($($attr:ident = $value:expr)+) [ $($inner:tt)+ ] $($rest:tt)*) => {
        $w.push({
            create_element!($tag,
                            {   let mut m = HashMap::new();
                                $(m.insert(stringify!($attr).replace("_", "-"), js!{return @{$value};} );)+
                                m},
                            {$($inner)+})
        });
        whtml!{$w, $($rest)*};
    };

    ($w:expr, $tag:ident { $($inner:tt)+ } $($rest:tt)*) => {
        $w.push({
            let mut v1:Vec<Value> = Vec::new();
            whtml!(v1, $($inner)+);
            create_element!($tag, Value::Null, v1)
        });
        whtml!($w, $($rest)*);
    };

    ($w:expr, $tag:ident ($($attr:ident = $value:expr)+) { } $($rest:tt)*) => {
        $w.push({
            let mut v2:Vec<Value> = Vec::new();
            create_element!($tag,
                            {   let mut m = HashMap::new();
                                $(m.insert(stringify!($attr).replace("_", "-"), js!{return @{$value};} );)+
                                m},
                            v2)
        });
        whtml!{$w, $($rest)*};
    };

    ($w:expr, $tag:ident ($($attr:ident = $value:expr)+) { $($inner:tt)+ } $($rest:tt)*) => {
        $w.push({
            let mut v3:Vec<Value> = Vec::new();
            whtml!(v3, $($inner)*);
            create_element!($tag,
                            {   let mut m = HashMap::new();
                                $(m.insert(stringify!($attr), js!{return @{$value};} );)+
                                m},
                            v3)
        });
        whtml!{$w, $($rest)*};
    };
}

#[macro_export]
macro_rules! html {
    ( $tag:ident $($t1:tt)+) => {
        { let mut v:Vec<Value> = Vec::new();
          whtml!(v, $tag $($t1)+);
          v.pop().unwrap()
        }
    };
}

#[macro_export]
macro_rules! react {
    ($($fct:ident),+) => {
        js!{
           if (!react_cmps) react_cmps={};
           $(react_cmps[@{stringify!($fct)}] = p => @{$fct}(p);)+
        }
    };
}

pub fn render(id:&str, comp:Value) {
    js! {
        ReactDOM.render(
            @{comp},
            document.getElementById(@{id})
        );
    };
}


//trait Query {
//    fn q(&self, query:&Vec<Box<Any>>) -> &Value;
//    //fn q1(&self, query:&Vec<Box<Any>>, len:usize) -> & Any;
//}

//impl Query for Val {
//    fn q(& self, query:Val) -> &Val{
//        let mut value = self;
//
//        for elem in query.as_array().unwrap().iter() {
//            if elem.is_i64() {
//                let ind = elem.as_u64().unwrap() as usize;
//                value = &value[ind]
//            }
//            else if elem.is_string() {
//                value = &value[elem.as_str().unwrap()];
//            }
//        }
//        value
//    }
//}

//impl Query for Val {
//    fn q(& self, query:Val) -> &Val{
//        let mut value = self;
//
//        for elem in query.as_array().unwrap().iter() {
//            if elem.is_i64() {
//                let ind = elem.as_u64().unwrap() as usize;
//                value = &value[ind]
//            }
//            else if elem.is_string() {
//                value = &value[elem.as_str().unwrap()];
//            }
//        }
//        value
//    }
//}

//impl Query for Val {
//    fn q<'a>(&'a self, query:&Val) -> &'a Val{
//
//        fn q1<'a>(value:&'a Val, query:&Vec<Val>, len:usize) -> &'a Val{
//            if len == 0 {return value;}
//            let elem = &query[query.len() - len];
//            if elem.is_i64() {
//                let ind = elem.as_u64().unwrap() as usize;
//                q1(&value[ind], query, len-1)
//            } else if elem.is_string() {
//                q1(&value[elem.as_str().unwrap()], query, len-1)
//            } else {
//                value
//            }
//        }
//
//        let query = query.as_array().unwrap();
//        q1(self, query, query.len())
//    }
//}

//impl Query for Any {
//    fn q<'a>(&'a self, query:&Vec<Box<Any>>) -> &'a Any{
//        //let query = query.downcast_ref::<Vec<Box<Any>>>().unwrap();
//        self.q1(query, query.len())
//    }
//    fn q1<'a>(&'a self, query:&Vec<Box<Any>>, len:usize) -> &'a Any{
//        console!(log, "entr", len as i32);
//        if len == 0 {
//            console!(log, "ret: ", *self.downcast_ref::<i32>().unwrap());
//            return self
//        }
//        let elem = &query[query.len() - len];
//        if elem.is::<i32>()  {
//            let ind = *elem.downcast_ref::<i32>().unwrap() as usize;
//            let res11 =&self.downcast_ref::<Vec<Box<Any>>>().unwrap()[ind];
//            //console!(log, "vec: ", ind as i32, *res11.downcast_ref::<i32>().unwrap());
//            let res22 = res11.as_ref();
//            res22.q1(query, len-1)
//            //q1(res11, query, len-1)
//
//        //q1(&value.downcast_ref::<Vec<Box<Any>>>().unwrap()[ind], query, len-1)
//        } else if elem.is::<&str>() {
//            let res11 = &self.downcast_ref::<HashMap<String, Box<Any>>>().unwrap()[elem.downcast_ref::<String>().unwrap()];
//            res11.q1( query, len-1)
//        } else {
//            self
//        }
//    }
//}

//fn kjkj<'a>(value:&'a Any, elem:&Box<Any>) -> Option<&'a Any> {
//    if elem.is::<i32>()  {
//        let ind = *elem.downcast_ref::<i32>()? as usize;
//        console!(log, "vec: ", ind as i32);
//        let collection =&value.downcast_ref::<Vec<Box<Any>>>()?;
//        let res =&collection[ind];
//        Some(res.as_ref())
//        collection.
//
//    } else if elem.is::<String>() {
//        let ind =  elem.downcast_ref::<String>()?;
//        console!(log, "map: ", ind);
//        let res = &value.downcast_ref::<HashMap<String, Box<Any>>>()?[ind];
//        Some(res.as_ref())
//    } else {
//        None
//    }
//}

//impl Query for Any {
//    fn q<'a>(&'a self, query:&Vec<Box<Any>>) -> &'a Any{
//        fn q1<'a>(value:&'a Any, query:&Vec<Box<Any>>, len:usize) -> Option<&'a Any>{
//            console!(log, "ind: ", len as i32);
//            if len == 0 {return Some(value);}
//            let elem = &query[query.len() - len];
//            if elem.is::<i32>()  {
//                let ind = *elem.downcast_ref::<i32>()? as usize;
//                console!(log, "vec: ", ind as i32);
//                let res =&value.downcast_ref::<Vec<Box<Any>>>()?[ind];
//                q1(res.as_ref(), query, len-1)
//            } else if elem.is::<String>() {
//                let ind =  elem.downcast_ref::<String>()?;
//                console!(log, "map: ", ind);
//                let res = &value.downcast_ref::<HashMap<String, Box<Any>>>()?[ind];
//                q1(res.as_ref(), query, len-1)
//            } else {
//                Some(value)
//            }
//        }
//        q1(self, query, query.len()).unwrap()
//    }
//}

//impl Query for Any {
//    fn q<'a>(&'a self, query:&Vec<Box<Any>>) -> &'a Any{
//        query.iter().try_fold(self,|acc, ref elem|{
//            if elem.is::<i32>()  {
//                let ind = *elem.downcast_ref::<i32>()? as usize;
//                console!(log, "vec: ", ind as i32);
//                let res =&acc.downcast_ref::<Vec<Box<Any>>>()?[ind];
//                Some(res.as_ref())
//            } else if elem.is::<String>() {
//                let ind =  elem.downcast_ref::<String>()?;
//                console!(log, "map: ", ind);
//                let res = &acc.downcast_ref::<HashMap<String, Box<Any>>>()?[ind];
//                Some(res.as_ref())
//            } else {
//                None
//            }
//        }).unwrap()
//    }
//}

//impl Query for Value {
//    fn q<'a>(&'a self, query:&Vec<Box<Any>>) -> &'a Value{
//        query.iter().map(self,|acc, ref elem|{
//            if elem.is::<i32>()  {
//                let ind = *elem.downcast_ref::<i32>()? as i32;
//                console!(log, "vec: ", ind as i32);
//                Some(js!(return @{acc}[@{ind}];))
//                //Some( &Vec::from(acc.as_array()?)[ind])
//                //let res =&vec[ind];
//                //Some(vec)
//            } else if elem.is::<String>() {
//                let ind =  elem.downcast_ref::<String>()?;
//                console!(log, "map: ", ind);
//                Some(js!(return @{acc}[@{ind}];))
//
////                let map1:HashMap<String, Value> = HashMap::from(acc.as_object()?);
////                //let res = &map1[ind];
////                Some(&map1[ind])
//            } else {
//                None
//            }
//        }).unwrap()
//    }
//}


