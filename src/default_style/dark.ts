import { paintRules, labelRules, DefaultStyleParams } from './style'

const dark:DefaultStyleParams = {
    earth:"#151515",
    glacier:"#1c1c1c",
    residential:"#252B2F",
    hospital:"#3E2C2C",
    cemetery:"#36483D",
    school:"#2C3440",
    industrial:"#33312C",
    wood:"#3A3E38",
    grass:"#4E604D",
    park:"#2C4034",
    water:"#4D5B73",
    sand:"#777777",
    buildings:"#464545",
    highwayCasing:"#000000",
    majorRoadCasing:"#1C1B1B",
    mediumRoadCasing:"#3E3E3E",
    minorRoadCasing:"#000000",
    highway:"#5B5B5B",
    majorRoad:"#595959",
    mediumRoad:"#4F4F4F",
    minorRoad:"#393939",
    boundaries:"#666666",
    mask:"#dddddd",
    countryLabel:"#ffffff",
    cityLabel:"#FFFFFF",
    stateLabel:"#ffffff",
    neighbourhoodLabel:"#FDFDFD",
    landuseLabel:"#DDDDDD",
    waterLabel:"#707E95",
    naturalLabel:"#4c4c4c",
    roadsLabel:"#C4C4C4",
    poisLabel:"#959393"
}

export const paint_rules = paintRules(dark)
export const label_rules = labelRules(dark)
