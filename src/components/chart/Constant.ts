/* eslint-disable @typescript-eslint/no-explicit-any */

export const ChartConfigurationData = {
  supports_search: false,
  supports_group_request: false,
  supports_marks: true,
  supports_timescale_marks: false,
  supports_time: false,
  supported_resolutions: ["1", "3", "5", "15", "30", "60"],
};

export const StopButtonInnerHTML = `
<svg version="1.1"
   id="svg2" inkscape:version="0.48.4 r9939" sodipodi:docname="stop-alt.svg" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24" height="24"
   viewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200" xml:space="preserve">
<path id="path22926" inkscape:connector-curvature="0" d="M600,0C268.629,0,0,268.629,0,600s268.629,600,600,600
  s600-268.629,600-600S931.371,0,600,0z M300,300h600v600H300V300z"/>
</svg>`;
export const SpeedSliderInnerHTML = `
<div style="display: flex; align-items: center;">
    <input type="range" min=".25" max="2" step=".25" value="1.0" class="slider" id="myRange">
    <label id="sliderValue" style="margin-left:1px;">1x</label>
</div>
`;
export const getOHLC = (arr: any) => {
  if (arr instanceof Array) {
    return arr.map(
      (val) => {
        return {
          time: getFormattedTime(val.date, val.time),
          close: val.close,
          open: val.open,
          high: val.high,
          low: val.low,
          volume: 0,
        };
        // {,
        //   },
      }
      // ];
    );
  }
};
export const getFormattedTime = (date: any, time: any) => {
  const dateStr = date.toString();
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const timeStr = time.toString();
  const hours = timeStr.slice(0, 2);
  const minutes = timeStr.slice(2, 4);
  const seconds = timeStr.slice(4, 6);
  const dateObj = new Date(
    `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  );
  return dateObj.getTime();
};