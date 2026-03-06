// js/data.js
// Importante: GeoJSON usa [LONGITUD, LATITUD]

export const LOTES = {
  type: "FeatureCollection",
  features: [
    // L01
    {
      type: "Feature",
      properties: { id:"L01",
        estado:"disponible",
        precio:"100,000",
        area_m2:111,
        perimetro_total:62,
        frente:10.18,
        fondo:10.21,
        derecha:20.37,
        izquierda:20.26,
        proyecto:"Proyecto Machayhuaycco",
        etapa:"Etapa 1",
        ubicacion:"Ayacucho, Perú"



      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.258028, -13.137633],
          [-74.257990, -13.137503],
          [-74.257802, -13.137511],
          [-74.257787, -13.137511],
          [-74.257927, -13.137680],
          [-74.258028, -13.137633]
        ]]
      }
    },

    // L02
    {
      type: "Feature",
      properties: { id: "L02", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257990, -13.137503],
          [-74.257963, -13.137415],
          [-74.257775, -13.137423],
          [-74.257802, -13.137511],
          [-74.257990, -13.137503]
        ]]
      }
    },

    // L03
    {
      type: "Feature",
      properties: { id: "L03", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257963, -13.137415],
          [-74.257938, -13.137327],
          [-74.257749, -13.137335],
          [-74.257775, -13.137423],
          [-74.257963, -13.137415]
        ]]
      }
    },

    // L04
    {
      type: "Feature",
      properties: { id: "L04", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257938, -13.137327],
          [-74.257911, -13.137240],
          [-74.257723, -13.137247],
          [-74.257749, -13.137335],
          [-74.257938, -13.137327]
        ]]
      }
    },

    // L05
    {
      type: "Feature",
      properties: { id: "L05", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257911, -13.137240],
          [-74.257886, -13.137152],
          [-74.257697, -13.137159],
          [-74.257723, -13.137247],
          [-74.257911, -13.137240]
        ]]
      }
    },

    // L06
    {
      type: "Feature",
      properties: { id: "L06", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257886, -13.137152],
          [-74.257859, -13.137064],
          [-74.257671, -13.137072],
          [-74.257697, -13.137159],
          [-74.257886, -13.137152]
        ]]
      }
    },

    // L07 (tenías el punto 3 repetido como 4; lo cierro correctamente)
    {
      type: "Feature",
      properties: { id: "L07", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257859, -13.137064],
          [-74.257834, -13.136976],
          [-74.257645, -13.136984],
          [-74.257671, -13.137072],
          [-74.257859, -13.137064]
        ]]
      }
    },

    // L08
    {
      type: "Feature",
      properties: { id: "L08", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257834, -13.136976],
          [-74.257807, -13.136888],
          [-74.257619, -13.136896],
          [-74.257645, -13.136984],
          [-74.257834, -13.136976]
        ]]
      }
    },

    // L09
    {
      type: "Feature",
      properties: { id: "L09", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257787, -13.137511],
          [-74.257802, -13.137511],
          [-74.257775, -13.137423],
          [-74.257749, -13.137335],
          [-74.257561, -13.137343],
          [-74.257716, -13.137425],
          [-74.257787, -13.137511]
        ]]
      }
    },

    // L10
    {
      type: "Feature",
      properties: { id: "L10", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257749, -13.137335],
          [-74.257723, -13.137247],
          [-74.257536, -13.137255],
          [-74.257561, -13.137343],
          [-74.257749, -13.137335]
        ]]
      }
    },

    // L11
    {
      type: "Feature",
      properties: { id: "L11", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257723, -13.137247],
          [-74.257697, -13.137159],
          [-74.257509, -13.137167],
          [-74.257536, -13.137255],
          [-74.257723, -13.137247]
        ]]
      }
    },

    // L12
    {
      type: "Feature",
      properties: { id: "L12", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257697, -13.137159],
          [-74.257671, -13.137072],
          [-74.257484, -13.137079],
          [-74.257509, -13.137167],
          [-74.257697, -13.137159]
        ]]
      }
    },

    // L13
    {
      type: "Feature",
      properties: { id: "L13", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257671, -13.137072],
          [-74.257645, -13.136984],
          [-74.257457, -13.136991],
          [-74.257484, -13.137079],
          [-74.257671, -13.137072]
        ]]
      }
    },

    // L14
    {
      type: "Feature",
      properties: { id: "L14", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257645, -13.136984],
          [-74.257619, -13.136896],
          [-74.257432, -13.136904],
          [-74.257457, -13.136991],
          [-74.257645, -13.136984]
        ]]
      }
    },

    // L15
    {
      type: "Feature",
      properties: { id: "L15", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257508, -13.137323],
          [-74.257463, -13.137173],
          [-74.257321, -13.137189],
          [-74.257346, -13.137214],
          [-74.257421, -13.137351],
          [-74.257508, -13.137323]
        ]]
      }
    },

    // L16
    {
      type: "Feature",
      properties: { id: "L16", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257463, -13.137173],
          [-74.257435, -13.137078],
          [-74.257229, -13.137100],
          [-74.257321, -13.137189],
          [-74.257463, -13.137173]
        ]]
      }
    },

    // L17
    {
      type: "Feature",
      properties: { id: "L17", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257435, -13.137078],
          [-74.257412, -13.137001],
          [-74.257160, -13.137029],
          [-74.257229, -13.137100],
          [-74.257435, -13.137078]
        ]]
      }
    },

    // L18
    {
      type: "Feature",
      properties: { id: "L18", estado: "disponible" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.257412, -13.137001],
          [-74.257384, -13.136905],
          [-74.257284, -13.136908],
          [-74.257217, -13.136918],
          [-74.257120, -13.136987],
          [-74.257160, -13.137029],
          [-74.257412, -13.137001]
        ]]
      }
    },
  ],
};