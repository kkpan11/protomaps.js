import Point from '@mapbox/point-geometry'
import { Zxy } from './tilecache'
import { PreparedTile, transformGeom } from './view'
import { PaintSymbolizer } from './symbolizer'

export interface Rule {
    minzoom:number
    maxzoom:number
    dataLayer: string
    symbolizer: PaintSymbolizer
    filter?(properties:any): boolean
}

// make this not depend on element?
export function painter(state,key,prepared_tiles:PreparedTile[],label_data,rules:Rule[],bbox,origin,clip:boolean,debug) {
    let start = performance.now()
    let ctx
    if (!state.ctx) {
        ctx = state.element.getContext('2d')
        state.ctx = ctx
    } else {
        ctx = state.ctx
    }
    // the element might not match the coordinate anymore...
    if (state.element && state.element.key != key) {
        return
    }
    ctx.setTransform(state.tile_size/256,0,0,state.tile_size/256,0,0)
    ctx.clearRect(0,0,256,256)
    ctx.miterLimit = 2

    ctx.save() // start translation
    ctx.translate(-origin.x,-origin.y)

    for (var prepared_tile of prepared_tiles) {
        let po = prepared_tile.origin
        let ps = prepared_tile.scale
        ctx.save()
        if (clip) {
            ctx.beginPath()
            ctx.rect(po.x,po.y,prepared_tile.dim,prepared_tile.dim)
            ctx.clip()
        }
        ctx.translate(po.x,po.y)
        for (var rule of rules) {
            if (rule.minzoom && prepared_tile.z < rule.minzoom) continue
            if (rule.maxzoom && prepared_tile.z > rule.maxzoom) continue
            var layer = prepared_tile.data.get(rule.dataLayer)
            if (layer === undefined) continue
            rule.symbolizer.before(ctx,prepared_tile.z)

            for (var feature of layer) {
                let geom = feature.geom
                let fbox = feature.bbox
                if (fbox[2]*ps+po.x < bbox[0] || fbox[0]*ps+po.x > bbox[2] || fbox[1]*ps+po.y > bbox[3] || fbox[3]*ps+po.y < bbox[1]) {
                    continue
                }
                let properties = feature.properties
                if (rule.filter && !rule.filter(properties)) continue
                if (ps != 1) {
                    geom = transformGeom(geom,ps, new Point(0,0))
                }
                rule.symbolizer.draw(ctx,geom,properties)
            }
        }
        ctx.restore()
    }

    let matches = label_data.search({minX:bbox[0],minY:bbox[1],maxX:bbox[2],maxY:bbox[3]})
    for (var label of matches) {
        ctx.save()
        ctx.translate(label.anchor.x,label.anchor.y)
        label.draw(ctx)
        ctx.restore()
        if (debug) {
            ctx.lineWidth = 0.5
            ctx.strokeStyle = debug
            ctx.fillStyle = debug
            ctx.globalAlpha = 1
            let anchor = label.anchor
            ctx.fillRect(anchor.x-2,anchor.y-2,4,4)
            for (let bbox of label.bbox) {
                ctx.strokeRect(bbox.minX,bbox.minY,bbox.maxX-bbox.minX,bbox.maxY-bbox.minY)
            }
        }
    }
    ctx.restore() // end translation
    return performance.now() - start
}