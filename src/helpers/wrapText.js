import { select } from "d3";

export function wrapText( width, selection ){    
    selection.each(function(){
        let el = select(this)
        let content = el.attr('data-content');
        el.text(null)
        
        let words = content.split(/\s+/).reverse(),
            word,
            line= [],
            lineNumber = 0,
            tspan = el.append("tspan")
                .attr("x", 0)
                .attr("y", 0)
                .attr("dy", 0);

        while(word = words.pop()){
            line.push(word);
            tspan.text(line.join(" "));

            let textWidth = tspan.node().getComputedTextLength()

            if(textWidth > width && line.length > 1){
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                lineNumber += 1;

                tspan = el.append("tspan")
                    .attr("x", el.attr("x"))
                    .attr("y", el.attr("y"))
                    .attr("dy", (lineNumber * 1.1) + "em")
                    .text(line.join(" "));
            }
        }
    })

    
}