//goog.provide("jsonLdHelpers");

var jsonLdHelpers = {};
/**
 * Converts a json-ld flattened data structure in a JavaScript graph.
 *
 * @param {Object} json The json-ld flattened data structure.
 * @return {Object} The equivalent JavaScript data structure.
 */
jsonLdHelpers.jsonld2map = function (json) {
    const context = json['@context'];

    function convertIfNodeXSD(node) {
        const ret = xsd(node, node['@value']);
        return ret ? ret : node;
    }

    function convertIfXSD(key, x){
        if (context[key]) return xsd(context[key], x);
        return x;
    }

    function xsd(type, x) {
        switch (type['@type']) {
            case 'xsd:integer': return parseInt(x);
            case 'xsd:int': return parseInt(x);
            case 'xsd:long': return parseInt(x);
            case 'xsd:decimal': return parseFloat(x);
            case 'xsd:double': return parseFloat(x);
            case 'xsd:float': return parseFloat(x);
        }

        return x;
    }

    const graph = Object.create(null);
    let keys =[];

    function getNode(node) {
        if (!node['@id']) return convertIfNodeXSD(node);
        if (graph[node['@id']]) return graph[node['@id']];

        graph[node['@id']] = node;
        keys.push(node['@id']);

        return node;
    }

    graph['@context'] = json['@context'];

    json['@graph'].forEach(x => {
        graph[x['@id']] = x
    });

    keys = Object.keys(graph);

    while (keys.length !== 0) {
        const id = keys.pop();

        Object.keys(graph[id]).forEach(key => {
            const x = graph[id][key];

            if (x instanceof Array) {
                x.forEach( (y,i,arr) => {
                    if (y instanceof Object) arr[i] = getNode(y);
                    else arr[i]= convertIfXSD(key, y)
                });
            }
            else if (x instanceof Object) graph[id][key] = getNode(x);
            else graph[id][key] = convertIfXSD(key, x)
        });
    }

    return graph;
};

/**
 * Converts a JavaScript graph in a json-ld flattened data structure.
 *
 * @param {Object} map A JavaScript graph data structure.
 * @return {Object} A json-ld flattened data structure.
 */
jsonLdHelpers.map2jsonld = function(map) {
    const context = map['context'];

    function addObj(map, graph, x) {
        if (x instanceof Object) {

            // If node isn't in map, it has to be included.
            if (!map[x['@id']]) {
                map[x['@id']] = x;
                // It also needs to be added to graph,
                // so it can be processed.
                graph.push(x);
            }

            const obj = Object.create(null);
            obj['@id'] = x['@id'];

            return obj;
        }
        return x;
    }

    const graph = [];

    Object.keys(map).forEach(id => {
        if(id !=='@context' && id !=='__proto__')
            graph.push(map[id]);
    });

    for(let i =0; i<graph.length; i++) {
        Object.keys(graph[i]).forEach(key => {
            if(key === '__proto__') return;

            const x = graph[i][key];

            if(x instanceof Array) {
                x.forEach((y,j,arr) => {
                    arr[j] = addObj(map, graph, y);
                });
            }
            else graph[i][key] = addObj(map, graph, x);
        });
    }

    const json = Object.create(null);

    json['@context'] = map['@context'];
    json['@graph'] = graph;

    return json;
};

// const json = {
//     "@context": {
//         name: "http://xmlns.com/foaf/0.1/name",
//         knows: "http://xmlns.com/foaf/0.1/knows"
//     },
//     "@graph": [
//         {
//             "@id": "_:b0",
//             name: "Dave Longley"
//         }, {
//             "@id": "http://manu.sporny.org/about#manu",
//             name: "Manu Sporny"
//         }, {
//             "@id": "http://me.markus-lanthaler.com/",
//             name: "Markus Lanthaler",
//             knows: [
//                 { "@id": "http://manu.sporny.org/about#manu" },
//                 { "@id": "_:b0" }
//             ]
//         }
//     ]
// };
//
// console.log(jsonld2map(json));
// console.log('jsonld2map ---------------------------------------');
// console.log(map2jsonld(jsonld2map(json)));
// console.log('map2jsonld ---------------------------------------');

jsonLdHelpers.createObject = function (triple) {
    if (triple.object.type === "uri") return {'@id': triple.object.value};
    return triple.object.value;
};

jsonLdHelpers.set = function (lst, triple) {
    for (i in lst) {
        const x = lst[i];

        if (x['@id'] === triple.subject.value) {
            const pred = triple.predicate.value;

            if (x[pred]) {
                if (x[pred] instanceof Array) x[pred].push(createObject(triple));
                else x[pred] = [x[pred], createObject(triple)];
            }
            else x[pred] = createObject(triple);

            return;
        }
    }

    lst.push({'@id':triple.subject.value});
    //console.log(lst)
    set(lst, triple)
};

/*
function loadDoc(url, query, context, resp) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log('Status: ' + this.status);
        if (this.readyState === 4 && this.status === 200) {
            console.log('Response:   '+ this.responseText);
            //const data = await jsonld.fromRDF(this.responseText, {});
            jsonld.fromRDF(this.responseText, {}, (err, doc) => {
                console.log('error: ' + err);
            //console.log('json: '+JSON.stringify(doc, null, 2));
            jsonld.flatten(doc, function (err, flatten) {
                console.log("\n\n flatten \n");
                //console.log(JSON.stringify(flatten, null, 2));
                jsonld.compact(flatten, context, resp);
            });
        });
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader('Accept', 'application/n-quads; charset=utf-8');//'text/turtle; charset=utf-8');//application/json');//rdf+xml');
    xhttp.send("query=" + encodeURIComponent(query));// + "&format=json");//ry&lname=Ford");
}
*/

jsonLdHelpers.loadTree = function(url, varmap, context, resp) {

    function mapVars(map) {
        let ret = '?';
        Object.keys(map).forEach(key => {
            ret = ret + key + '=' + encodeURIComponent(map[key]) + '&';
        });

        // console.log("query = " + ret);
        return ret.substring(0, ret.length-1);
    }

    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        //console.log('Status: ' + this.status+" - "+this.responseText);

        if (this.readyState === 4 && this.status === 200) {
            //console.log('Response:   '+ this.responseText);
            // console.log('Response:   ');
            // console.log('json: '+JSON.stringify(JSON.parse(this.responseText), null, 2));

            //alert("jjjjjjj");

            jsonld.flatten(JSON.parse(this.responseText), function (err, flatten) {
                // console.log("\n\n Flatten: \n");
                // console.log(JSON.stringify(flatten, null, 2));
                jsonld.compact(flatten, context, resp);
            });
        }
    };

    xhttp.open('GET', url+mapVars(varmap));

    //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhttp.setRequestHeader('Accept', 'application/n-quads; charset=utf-8');//'text/turtle; charset=utf-8');//application/json');//rdf+xml');

    xhttp.send();//"query=" + encodeURIComponent(query));// + "&format=json");//ry&lname=Ford");
};

// loadTree(
//     "/sparql", //url
//     {node: 'http://semantic.icmc.usp.br/sustenagro#TechnologicalEfficiencyInTheIndustrial', lang: 'en'},
//     {   xsd: "http://www.w3.org/2001/XMLSchema#",
//         "@language": "en",
//         name: "http://semantic.icmc.usp.br/sustenagro#",
//         ui: "http://purl.org/biodiv/semanticUI#",
//         label: "http://www.w3.org/2000/01/rdf-schema#label",
//         subClass: "http://temp/subClass",
//         // The next line would be the best way of defining the property subClass
//         // but it doesn't work.
//         //child: {'@reverse':'http://www.w3.org/2000/01/rdf-schema#subClassOf'},
//         value: "ui:value",
//         hasWeight: "ui:hasWeight",
//         //number: {'@id':'http://purl.org/biodiv/semanticUI#asNumber', '@type': 'xsd:double'}
//         asNumber: 'http://purl.org/biodiv/semanticUI#asNumber'
//     },
//     (err, doc) => {
//         console.log('error: ' + err);
//         console.log('json: ' + JSON.stringify(doc, null, 2));
//         console.log(jsonld2map(doc));
//     });

//var url = "https://cors-anywhere.herokuapp.com/http://dilvan.icmc.usp.br:9999/blazegraph/namespace/kb/sparql"
//var url = "https://cors-anywhere.herokuapp.com/http://java.icmc.usp.br:2472/sparql"
//const url = "http://dilvan.icmc.usp.br:7200/repositories/sustenagro";
// const url = "http://localhost:7200/repositories/sustenagro";
//
// const query =`
// #PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
// #PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
// #PREFIX owl: <http://www.w3.org/2002/07/owl#>
// PREFIX ui: <http://purl.org/biodiv/semanticUI#>
// CONSTRUCT {
//   ?parent rdf:type ?type;
//           rdfs:subClasses ?child;
//           ui:relevance ?relevance;
//           rdfs:label ?parentLabel;
//           ui:hasWeight ?weight.
//   ?child rdfs:values ?value;
//          rdfs:label ?childLabel.
//   ?value rdfs:label ?valueLabel;
//          ui:asNumber ?number.
//   ?weight rdfs:label ?weightLabel;
//          ui:asNumber ?wNumber.
// }
// WHERE {
//   #values ?parent {<http://semantic.icmc.usp.br/sustenagro#EnvironmentalIndicator>}
//   ?parent rdfs:subClassOf <http://semantic.icmc.usp.br/sustenagro#TechnologicalEfficiencyInTheIndustrial>;
//           a ?type;
//           rdfs:label ?parentLabel.
//   ?child rdfs:subClassOf ?parent;
//          rdfs:label ?childLabel.
//   # Get ride of 1. class is a subclass of itself and 2. blank nodes.
//   FILTER (?parent != ?child && !isBlank(?child) && !isBlank(?parent))
//   # Only labels in one language needed
//   FILTER(langMatches(lang(?parentLabel),"en") && langMatches(lang(?childLabel),"en"))
//
//   OPTIONAL {?parent ui:relevance ?relevance.}
//
//   # This filter gets rid of classes that are not imediate subclasses.
//   # It gets rid of children classes that are also grandchildren classes
//   FILTER NOT EXISTS {
//     ?child2 rdfs:subClassOf ?parent.
//     ?child rdfs:subClassOf ?child2.
//     FILTER (?parent != ?child2 && ?child != ?child2)# && ?child = ?grand2)
//   }
//
//   # Gets the instances in X in ?child SubclassOf(Restriction in property ui:value someValuesFrom X)
//   # If X is a list of oneOf: it gets the instances in this list
//   # If X is a Class: It gets all instances belonging to this class
//   # For each instance, it also gets its label and ui:asNumber property
//   OPTIONAL{
//     ?child rdfs:subClassOf ?a.
//     ?a owl:onProperty ui:value.
//     ?a owl:someValuesFrom ?cls.
//
//     {?cls owl:oneOf/(rdf:first|rdf:rest+/rdf:first) ?value.}
//     union {FILTER(?cls != ui:Categorical) ?value a ?cls.}
//
//     ?value rdfs:label ?valueLabel;
//            ui:asNumber ?number.
//     FILTER(langMatches(lang(?valueLabel), "en"))
//   }
//
//   # Gets the instances in X in ?parent SubclassOf(Restriction in hasWeight ui:value someValuesFrom X)
//   # If X is a list of oneOf: it gets the instances in this list
//   # If X is a Class: It gets all instances belonging to this class
//   # For each instance, it also gets its label and ui:asNumber property
//   OPTIONAL{
//     ?parent rdfs:subClassOf ?wRestriction.
//     ?wRestriction owl:onProperty ui:hasWeight.
//     ?wRestriction owl:someValuesFrom ?wCls.
//     {?wCls owl:oneOf/(rdf:first|rdf:rest+/rdf:first) ?weight.}
//     union {FILTER(?wCls != ui:Categorical) ?weight a ?wCls.}
//
//     ?weight rdfs:label ?weightLabel;
//            ui:asNumber ?wNumber.
//      FILTER(langMatches(lang(?weightLabel), "en"))
//   }
// }
// #limit 1000000
//     `;

// let queryUrl = url+"?query="+encodeURIComponent( query);//+"&format=json");
//console.log(queryUrl)

/*
loadDoc(
    url,
    query,
    {   "xsd": "http://www.w3.org/2001/XMLSchema#",
        "@language": "en",
        name: "http://semantic.icmc.usp.br/sustenagro#",
        ui: "http://purl.org/biodiv/semanticUI#",
        label: "http://www.w3.org/2000/01/rdf-schema#label",
        subClassOf: "http://www.w3.org/2000/01/rdf-schema#subClassOf",
        subClasses: "http://www.w3.org/2000/01/rdf-schema#subClasses",
        values: "http://www.w3.org/2000/01/rdf-schema#values",
        weights: "ui:hasWeight",
        asNumber: {'@id':"ui:asNumber", '@type': 'xsd:double'}
    }, (err, doc) => {
        console.log('error: ' + err);
        console.log('json: ' + JSON.stringify(doc, null, 2));
        console.log(jsonld2map(doc));
    }
);
*/
// alert (queryUrl)
// $.ajax({
//     //dataType: "json",
//     url: queryUrl,
//     headers: {'Accept': 'application/n-quads'},
//     //headers: {'X-Requested-With': 'XMLHttpRequest'},
//     //crossDomain: false,
//     success: function( _data ) {
//         console.log("Data: "+_data);
//         var results = _data.results.bindings;
//         var obj = [];
//         results.forEach(x => set(obj, x));
//         console.log(obj);
//         //var str = new XMLSerializer().serializeToString(_data.documentElement);
//         //console.log(str)
//
//         var context = {
//             "name":  "http://pt.dbpedia.org/resource/",
//             "label":  "http://www.w3.org/2000/01/rdf-schema#label"
//         };
//
//         jsonld.compact(obj, context, function(err, compacted) {
//             console.log(JSON.stringify(compacted, null, 2));
//             /* Output:
//             {
//               "@context": {...},
//               "name": "Manu Sporny",
//               "homepage": "http://manu.sporny.org/",
//               "image": "http://manu.sporny.org/images/manu.png"
//             }
//             */
//         });
//
//
//         return
//     }
// });