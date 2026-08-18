const GROUPS = {
  spindle: ["Шпиндель", "#49a5ff", "73,165,255", "spindle", "Управление вращением главного шпинделя и скоростью резания.", "Перед запуском убедись, что заготовка надёжно зажата, а зона вращения свободна."],
  chuck: ["Патрон", "#4ee8f2", "78,232,242", "chuck", "Зажим и разжим заготовки в патроне станка.", "Разжимать патрон можно только при полностью остановленном шпинделе."],
  turret: ["Револьвер", "#ff9d3d", "255,157,61", "turret", "Ручная индексация, зажим и обслуживание револьверной головки.", "Может привести к потере позиции инструмента. Проверь безопасное положение перед разжимом."],
  coolant: ["СОЖ", "#78ef62", "120,239,98", "coolant", "Включение и отключение подачи охлаждающей жидкости или воздуха.", "Проверь направление сопла и закрытие защитной двери."],
  tailstock: ["Задняя бабка", "#f15b99", "241,91,153", "tailstock", "Подвод и отвод задней бабки для поддержки длинной заготовки.", "Перед перемещением проверь свободный ход и положение инструмента."],
  thread: ["Резьба", "#48cef2", "72,206,242", "thread", "Нарезание резьбы резцом или метчиком с заданным шагом.", "Неверный шаг, подача или направление могут сломать инструмент и повредить деталь."],
  feed: ["Подача", "#48dbe6", "72,219,230", "feed", "Настройка режима подачи и характера движения по траектории.", "Проверь единицы подачи: мм/мин и мм/об — это разные режимы."],
  correction: ["Коррекция", "#ffd23f", "255,210,63", "correction", "Компенсация радиуса, положения и геометрии инструмента.", "Неверная сторона коррекции может направить инструмент внутрь контура."],
  offset: ["Нулевые смещения", "#b76cff", "183,108,255", "offset", "Выбор и управление системой координат заготовки.", "Перед циклом проверь активное нулевое смещение и фактический ноль детали."],
  path: ["Траектория", "#50a9ff", "80,169,255", "path", "Линейные, круговые и сглаженные перемещения инструмента.", "Проверь координаты конечной точки, плоскость и безопасный подвод."],
  program: ["Программа", "#8aa9ff", "138,169,255", "program", "Остановка, завершение, перемотка и вызов подпрограмм.", "Убедись, что продолжение или повторный запуск программы безопасен."],
  tool: ["Инструмент", "#f2b84b", "242,184,75", "tool", "Смена инструмента и работа с измерительным щупом.", "Перед движением проверь свободное пространство и корректный номер инструмента."],
  plane: ["Плоскость", "#49d9b3", "73,217,179", "plane", "Выбор рабочей плоскости для интерполяции и коррекции.", "Неверная плоскость изменит направление дуг и работу коррекции."],
  speed: ["Скорость", "#ffbf47", "255,191,71", "speed", "Режимы постоянной скорости резания и ограничения оборотов.", "При G96 обязательно задавай безопасное ограничение максимальных оборотов."],
  brake: ["Тормоз", "#ff6b62", "255,107,98", "brake", "Фиксация и освобождение главного шпинделя.", "Не включай тормоз на вращающемся шпинделе."],
  transform: ["Трансформации", "#ba72ff", "186,114,255", "transform", "Поворот, масштабирование, зеркалирование и преобразование координат.", "Проверь активную систему координат и отменяй трансформацию после обработки."],
};

const RAW_M = [
  ["M00","Останов программы","Program stop","program"],
  ["M01","Выборочный останов программы","Optional stop","program"],
  ["M02","Завершение программы","End of program","program"],
  ["M03","Вращение шпинделя вперёд","Spindle CW","spindle"],
  ["M04","Реверс шпинделя","Spindle CCW","spindle"],
  ["M05","Остановка шпинделя","Spindle stop","spindle"],
  ["M06","Автоматическая смена инструмента","Auto tool change","tool"],
  ["M07","Подача воздуха / туман","Mist ON","coolant"],
  ["M08","СОЖ включена","Coolant ON","coolant"],
  ["M09","СОЖ выключена","Coolant OFF","coolant"],
  ["M10","Зажим патрона","Chuck clamp","chuck"],
  ["M11","Разжим патрона","Chuck unclamp","chuck"],
  ["M24","Выдвинуть щуп инструмента","Tool setter extend","tool"],
  ["M25","Убрать щуп инструмента","Tool setter retract","tool"],
  ["M28","Отмена жёсткого нарезания резьбы","Rigid tapping cancellation","thread"],
  ["M29","Жёсткое нарезание резьбы","Rigid tapping","thread"],
  ["M30","Конец программы и возврат в начало","Program rewind","program"],
  ["M50","Конвейер стружки вперёд","Chip conveyor forward","feed"],
  ["M60","Тормоз шпинделя включён","Spindle brake ON","brake"],
  ["M61","Тормоз шпинделя выключен","Spindle brake OFF","brake"],
  ["M75","Револьвер разжим","Turret unclamp","turret"],
  ["M76","Револьвер зажим","Turret clamp","turret"],
  ["M78","Задняя бабка вперёд","Tailstock advance","tailstock"],
  ["M79","Задняя бабка назад","Tailstock retract","tailstock"],
  ["M80","Маховик шпинделя включён","Spindle handwheel control ON","spindle"],
  ["M81","Маховик шпинделя выключен","Spindle handwheel control OFF","spindle"],
  ["M98","Вызов подпрограммы","Calling of subprogram","program"],
  ["M99","Возврат из подпрограммы","End of subprogram","program"],
];

const RAW_G = [
  ["G0","Быстрое перемещение","Rapid traverse","path"],
  ["G1","Линейная интерполяция","Linear interpolation","path"],
  ["G2","Круговая интерполяция по часовой","Clockwise circular interpolation","path"],
  ["G3","Круговая интерполяция против часовой","Counterclockwise circular interpolation","path"],
  ["CIP","Дуга через промежуточную точку","Circular interpolation via intermediate point","path"],
  ["G70","Дюймовая система: геометрия","Activate inch system (geometric data)","offset"],
  ["G71","Метрическая система: геометрия","Activate metric system (geometric data)","offset"],
  ["G700","Дюймовая система: геометрия + процесс","Activate inch system (geometric + process data)","offset"],
  ["G710","Метрическая система: геометрия + процесс","Activate metric system (geometric + process data)","offset"],
  ["G90","Абсолютное программирование","Absolute dimensioning","offset"],
  ["G91","Инкрементальное программирование","Incremental dimensioning","offset"],
  ["G17","Рабочая плоскость X/Y","Select X/Y working plane","plane"],
  ["G18","Рабочая плоскость Z/X","Select Z/X working plane","plane"],
  ["G19","Рабочая плоскость Y/Z","Select Y/Z working plane","plane"],
  ["G93","Подача в обратном времени","Inverse time feed rate","feed"],
  ["G94","Линейная подача, мм/мин","Linear feed rate","feed"],
  ["G95","Подача на оборот, мм/об","Rotational feed rate","feed"],
  ["G96","Постоянная скорость резания","Constant cutting speed","speed"],
  ["G961","Постоянная скорость резания, линейная подача","Constant cutting speed (linear feed mode)","speed"],
  ["G962","Постоянная скорость, линейная + оборотная подача","Constant cutting speed (linear + rotational feed)","speed"],
  ["G97","Отмена постоянной скорости резания","Cancel constant cutting speed","speed"],
  ["G971","Отмена G96, линейная подача","Cancel constant cutting speed (linear feed)","speed"],
  ["G972","Отмена G96, линейная/оборотная подача","Cancel constant cutting speed (linear/rotational feed)","speed"],
  ["G973","Отмена G96 без ограничения скорости","Cancel constant cutting speed (no speed limit)","speed"],
  ["G25","Нижний предел оборотов шпинделя","Spindle speed lower limit","speed"],
  ["G26","Верхний предел оборотов шпинделя","Spindle speed upper limit","speed"],
  ["G40","Отмена коррекции радиуса","Cancel tool radius compensation","correction"],
  ["G41","Коррекция радиуса слева от контура","Tool radius compensation left","correction"],
  ["G42","Коррекция радиуса справа от контура","Tool radius compensation right","correction"],
  ["G140–G143","Плавный подвод и отвод: базовый режим","Soft approach and retraction (basic)","path"],
  ["G147–G148","Плавный подвод и отвод: расширенный","Soft approach and retraction (extended)","path"],
  ["G247–G248","Плавный подвод и отвод: 2D","Soft approach and retraction (2D)","path"],
  ["G340–G341","Плавный подвод и отвод: 3D","Soft approach and retraction (3D)","path"],
  ["G347–G348","Плавный подвод: специальный инструмент","Soft approach (special tool mode)","path"],
  ["G460–G462","Расширенные стратегии отвода","Extended retraction strategies","path"],
  ["CUT2D","2.5D-коррекция: базовый режим","2 1/2 D tool offset (basic mode)","correction"],
  ["CUT2DD","2.5D-коррекция: режим глубины","2 1/2 D tool offset (depth mode)","correction"],
  ["CUT2DF","2.5D-коррекция: режим подачи","2 1/2 D tool offset (feed mode)","correction"],
  ["CUT2DFD","2.5D-коррекция: глубина + подача","2 1/2 D tool offset (depth + feed)","correction"],
  ["CUTCONON","Постоянная коррекция радиуса","Keep tool radius compensation constant","correction"],
  ["CUTCONOF","Отмена постоянной коррекции","Cancel constant tool radius compensation","correction"],
  ["G53","Подавление задаваемого и программного смещения","Suppress settable + programmable zero offset","offset"],
  ["G54–G59","Выбор нулевого смещения 1–6","Call 1st–6th settable zero offset","offset"],
  ["G500","Отключить текущее нулевое смещение","Close current settable zero offset","offset"],
  ["G507–G599","Выбор нулевого смещения 7–99","Call 7th–99th settable zero offset","offset"],
  ["G153","Подавить все нулевые смещения","Suppress all zero offsets","offset"],
  ["G60","Режим точного останова","Exact stop mode","path"],
  ["G601","Точный останов","Exact stop precise","path"],
  ["G602","Приблизительный точный останов","Exact stop coarse","path"],
  ["G603","Точный останов с буфером","Exact stop with buffer","path"],
  ["G64","Непрерывная работа по траектории","Continuous path mode","path"],
  ["G641–G646","Непрерывная траектория: уровни сглаживания","Continuous path mode (smoothing levels)","path"],
  ["G62","Замедление во внутреннем углу","Inner corner deceleration","path"],
  ["G621","Замедление во всех углах","All corner deceleration","path"],
  ["G450","Обход внешнего угла по дуге","External corner traversal (circular)","path"],
  ["G451","Обход внешнего угла под острым углом","External corner traversal (acute angle)","path"],
  ["G33","Резьба с постоянным шагом","Thread cutting with constant pitch","thread"],
  ["G34","Резьба с увеличивающимся шагом","Thread cutting with increasing pitch","thread"],
  ["G35","Резьба с уменьшающимся шагом","Thread cutting with decreasing pitch","thread"],
  ["G331","Жёсткое резьбонарезание вперёд","Rigid tapping forward","thread"],
  ["G332","Жёсткое резьбонарезание назад","Rigid tapping reverse","thread"],
  ["G63","Резьба с компенсирующим патроном","Tapping with compensation chuck","thread"],
  ["G335","Выпуклая резьба","Convex thread cutting","thread"],
  ["G336","Специальная выпуклая резьба","Special convex thread cutting","thread"],
  ["G110","Полярная точка от последней позиции","Polar reference point (last return position)","offset"],
  ["G111","Полярная точка от нуля заготовки","Polar reference point (workpiece zero)","offset"],
  ["G112","Полярная точка от последнего полюса","Polar reference point (last valid pole)","offset"],
  ["CFTCP","Постоянная подача по центру инструмента","Constant feed on tool center trajectory","feed"],
  ["CFC","Постоянная подача по контуру","Constant feed on contour","feed"],
  ["CFIN","Оптимизация подачи на вогнутом контуре","Constant feed on concave contour","feed"],
  ["G4","Пауза","Dwell time","program"],
  ["G74","Подход к опорной точке","Reference point approach","offset"],
  ["G75","Подход к фиксированной точке","Approaching a fixed point","offset"],
  ["G290","Переключение языка: режим 1","Switch language mode (Mode 1)","program"],
  ["G291","Переключение языка: режим 2","Switch language mode (Mode 2)","program"],
  ["G5","Косое врезание: режим 1","Oblique plunge-cutting (Mode 1)","path"],
  ["G7","Косое врезание: режим 2","Oblique plunge-cutting (Mode 2)","path"],
  ["PTP","Декартово перемещение точка-точка","Cartesian PTP travel","path"],
  ["PTPG0","PTP в режиме быстрого хода","Cartesian PTP travel in rapid traverse","path"],
  ["PTPWOC","PTP без контроля столкновений","PTP travel without collision control","path"],
  ["CTRANS","Грубое смещение трансформации","Coarse transformation offset","transform"],
  ["CFINE","Точное смещение трансформации","Fine transformation offset","transform"],
  ["TRAFOON","Включить преобразование координат","Activate coordinate transformation","transform"],
  ["TRAFOOF","Отключить преобразование координат","Deactivate coordinate transformation","transform"],
  ["TRANSMIT","Трансформация торца","Activate face end transformation","transform"],
  ["TRACYL","Трансформация цилиндрической поверхности","Activate cylinder surface transformation","transform"],
  ["TRAANG","Трансформация с программируемым углом","Transformation with programmable angle","transform"],
  ["ROT","Программируемый поворот","Programmable rotation","transform"],
  ["AROT","Дополнительный поворот","Additional programmable rotation","transform"],
  ["RPL","Задать угол поворота","Rotation angle setting","transform"],
  ["SCALE","Программируемое масштабирование","Programmable scaling","transform"],
  ["ASCALE","Дополнительное масштабирование","Additional programmable scaling","transform"],
  ["MIRROR","Программируемое зеркалирование","Programmable mirroring","transform"],
  ["AMIRROR","Дополнительное зеркалирование","Additional programmable mirroring","transform"],
  ["TOFRAME","Поворот фрейма по инструменту/детали","Frame rotation to align at tool or workpiece","transform"],
  ["TOROT","Поворот ориентации инструмента","Tool orientation rotation","transform"],
  ["PAROT","Параллельный поворот","Parallel rotation","transform"],
];

const M_CODES = RAW_M.map(([code,title,english,group]) => ({ code,title,english,group,type:"M" }));
const G_CODES = RAW_G.map(([code,title,english,group]) => ({ code,title,english,group,type:"G" }));
const ALL_CODES = [...M_CODES, ...G_CODES];
const EXTRA = {
  M75: {
    description: "Отпускание зажимного механизма револьвера. Позволяет вращать и индексировать револьвер при ручном управлении.",
    warning: "Может привести к потере позиции инструмента. Убедись, что инструмент безопасен перед разжимом.",
    use: "Используется для ручной индексации револьвера или смены инструмента."
  },
  M76: { description: "Фиксирует револьверную головку в выбранной позиции после ручной индексации." }
};

const ICONS = {
  spindle:'<path d="M2 13h5v6H2zM25 13h5v6h-5zM7 10h4v12H7zM21 10h4v12h-4zM11 8h10v16H11zM13 12h6M13 16h6M13 20h6"/>',
  chuck:'<circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="4"/><path d="M16 4v8M26.4 22l-6.9-4M5.6 22l6.9-4"/>',
  turret:'<circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="5"/><path d="M12 5l2 5M20 5l-2 5M27 12l-5 2M27 20l-5-2M20 27l-2-5M12 27l2-5M5 20l5-2M5 12l5 2"/>',
  coolant:'<path d="M16 3S8 13 8 20a8 8 0 0016 0c0-7-8-17-8-17zM13 23c-1.5-1.5-1.7-3.6-.6-5.5"/>',
  tailstock:'<path d="M5 9h16l5 6-5 6H5zM9 9V5M9 21v6M4 27h12M22 13h7v6h-7"/><circle cx="15" cy="15" r="3"/>',
  thread:'<path d="M9 3c7 0 7 5 0 5s-7 5 0 5 7 5 0 5-7 5 0 5 7 5 0 5M16 5h10M16 11h10M16 17h10M16 23h10"/>',
  feed:'<path d="M3 18c4 0 4-8 8-8s4 12 8 12 4-8 10-8M4 26h24M24 22l4 4-4 4"/>',
  correction:'<path d="M5 25l4-9 12-12 7 7-12 12zM9 16l7 7M19 6l7 7M5 25l6-1-5-5z"/>',
  offset:'<circle cx="16" cy="16" r="9"/><circle cx="16" cy="16" r="3"/><path d="M16 2v8M16 22v8M2 16h8M22 16h8"/>',
  path:'<path d="M4 24c3-8 6-12 10-12 5 0 4 8 9 8 2 0 4-2 5-5"/><circle cx="4" cy="24" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="28" cy="15" r="2"/>',
  program:'<path d="M8 3h12l6 6v20H8zM20 3v7h6M12 16h10M12 21h10"/>',
  tool:'<path d="M6 5h20v6l-8 4v12h-4V15l-8-4zM10 8h12"/>',
  plane:'<path d="M5 25V7M5 25h21M5 25l16-16M5 7l-2 4M5 7l3 4M26 25l-4-2M26 25l-4 3"/>',
  speed:'<path d="M5 23a12 12 0 1122 0M16 17l7-6M8 23h16"/>',
  brake:'<circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="4"/><path d="M8 8l5 5M24 8l-5 5M8 24l5-5M24 24l-5-5"/>',
  transform:'<path d="M7 11V5h6M25 21v6h-6M11 25H5v-6M21 7h6v6M7 5l7 7M25 27l-7-7M5 25l7-7M27 7l-7 7"/>',
  search:'<circle cx="14" cy="14" r="9"/><path d="M21 21l7 7"/>',
  star:'<path d="M16 3l4 8 9 1-6.5 6.5 1.5 9-8-4.5-8 4.5 1.5-9L3 12l9-1z"/>',
  wifi:'<path d="M4 12c7-6 17-6 24 0M8 17c5-4 11-4 16 0M12 22c3-2 5-2 8 0"/><circle cx="16" cy="26" r="1" fill="currentColor"/>',
  mic:'<rect x="11" y="4" width="10" height="17" rx="5"/><path d="M6 16a10 10 0 0020 0M16 26v4M11 30h10"/>',
  share:'<circle cx="8" cy="16" r="3"/><circle cx="24" cy="7" r="3"/><circle cx="24" cy="25" r="3"/><path d="M11 14l10-5M11 18l10 5"/>',
  shield:'<path d="M16 3l11 4v8c0 7-4 12-11 15C9 27 5 22 5 15V7zM11 16l3 3 7-8"/>',
  warning:'<path d="M16 3l14 25H2zM16 11v8M16 24h.01"/>',
  info:'<circle cx="16" cy="16" r="13"/><path d="M16 14v9M16 9h.01"/>',
  book:'<path d="M4 5h9a5 5 0 015 5v18a5 5 0 00-5-5H4zM28 5h-9a5 5 0 00-5 5v18a5 5 0 015-5h9z"/>',
  calculator:'<rect x="7" y="3" width="18" height="26" rx="3"/><path d="M11 7h10v5H11zM11 17h2M16 17h2M21 17h.01M11 22h2M16 22h2M21 22h.01"/>',
  folder:'<path d="M3 8h10l3 4h13v15H3z"/>',
  user:'<circle cx="16" cy="10" r="6"/><path d="M5 29c1-8 5-11 11-11s10 3 11 11"/>'
};

function icon(name, size=28) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.program}</svg>`;
}
function esc(value) { return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]); }
function css(group) { const meta=GROUPS[group]; return `--accent:${meta[1]};--accent-rgb:${meta[2]}`; }

let state = { tab:"M", query:"", group:"all", selected:"M75", favorites:[] };
try { state.favorites = JSON.parse(localStorage.getItem("cnc-code-favorites") || "[]"); } catch { state.favorites=[]; }

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const listEl = $("#code-list");
const categoryEl = $("#categories");

function currentBase() {
  if (state.tab === "favorites") return ALL_CODES.filter(c => state.favorites.includes(c.code));
  return state.tab === "M" ? M_CODES : G_CODES;
}
function filteredCodes() {
  const q = state.query.trim().toLocaleLowerCase("ru");
  return currentBase().filter(c => (state.group === "all" || c.group === state.group) && (!q || `${c.code} ${c.title} ${c.english} ${GROUPS[c.group][0]}`.toLocaleLowerCase("ru").includes(q)));
}
function selectedCode() { return ALL_CODES.find(c => c.code === state.selected) || filteredCodes()[0] || M_CODES[0]; }
function saveFavorites() { localStorage.setItem("cnc-code-favorites", JSON.stringify(state.favorites)); }
function toggleFavorite(code) {
  state.favorites = state.favorites.includes(code) ? state.favorites.filter(x => x !== code) : [...state.favorites, code];
  saveFavorites(); render();
}

function renderCategories() {
  const groups = [...new Set(currentBase().map(c => c.group))];
  const allIcon = state.tab === "G" ? "path" : "program";
  categoryEl.innerHTML = `<button class="category-card ${state.group === "all" ? "active" : ""}" style="--accent:#41a8ff;--accent-rgb:65,168,255" data-group="all"><span class="category-icon">${icon(allIcon,34)}</span><span>Все коды</span></button>` + groups.map(id => {
    const m=GROUPS[id]; return `<button class="category-card ${state.group === id ? "active" : ""}" style="${css(id)}" data-group="${id}"><span class="category-icon">${icon(m[3],35)}</span><span>${esc(m[0])}</span></button>`;
  }).join("");
  categoryEl.querySelectorAll("[data-group]").forEach(btn => btn.addEventListener("click", () => { state.group=btn.dataset.group; render(); }));
}

function renderList() {
  const rows = filteredCodes();
  $("#result-label").textContent = state.tab === "favorites" ? "Избранные" : `${state.tab}-коды`;
  $("#result-count").textContent = rows.length;
  if (!rows.length) {
    listEl.innerHTML = `<div class="empty-state glass">${icon(state.tab === "favorites" ? "star" : "search",42)}<h3>${state.tab === "favorites" ? "Избранных кодов пока нет" : "Ничего не найдено"}</h3><p>${state.tab === "favorites" ? "Нажми звезду возле нужной команды — она останется здесь даже без интернета." : "Попробуй код, например M75, G96 или слово «патрон»."}</p></div>`;
    return;
  }
  listEl.innerHTML = rows.map(c => {
    const meta=GROUPS[c.group], favorite=state.favorites.includes(c.code), selected=c.code===state.selected;
    return `<article role="listitem" class="code-row glass ${selected ? "selected" : ""}" style="${css(c.group)}" data-code="${esc(c.code)}"><span class="row-accent"></span><span class="row-icon">${icon(meta[3],27)}</span><b class="row-code">${esc(c.code)}</b><span class="row-copy"><strong>${esc(c.title)}</strong><small>${esc(c.english)}</small></span><button class="row-star ${favorite ? "active" : ""}" data-star="${esc(c.code)}" aria-label="Избранное">${icon("star",22)}</button></article>`;
  }).join("");
  listEl.querySelectorAll("[data-code]").forEach(row => row.addEventListener("click", e => { if (e.target.closest("[data-star]")) return; state.selected=row.dataset.code; render(); openSheet(); }));
  listEl.querySelectorAll("[data-star]").forEach(btn => btn.addEventListener("click", e => { e.stopPropagation(); toggleFavorite(btn.dataset.star); }));
}

function detailHTML(code, close=false) {
  const meta=GROUPS[code.group], extra=EXTRA[code.code] || {}, favorite=state.favorites.includes(code.code);
  const description=extra.description || `${code.title}. Команда относится к разделу «${meta[0]}» и применяется в управляющей программе SINUMERIK.`;
  return `<aside class="detail-panel" style="${css(code.group)}"><div class="detail-handle"></div><div class="detail-head"><span class="detail-code">${esc(code.code)}</span><button class="icon-button star-button ${favorite ? "active" : ""}" data-detail-star="${esc(code.code)}" aria-label="Избранное">${icon("star",23)}</button><button class="icon-button" data-share="${esc(code.code)}" aria-label="Поделиться">${icon("share",21)}</button>${close ? '<button class="close-button" data-close aria-label="Закрыть">×</button>' : ""}</div><h2>${esc(code.title)}</h2><p class="english">${esc(code.english)}</p><div class="info-card group-card"><span class="info-icon">${icon(meta[3],25)}</span><div><b>Группа</b><p>${esc(meta[0])}</p></div></div><div class="info-card description-card"><span class="info-icon blue">${icon("program",25)}</span><div><b>Описание</b><p>${esc(description)}</p></div></div><div class="info-card warning-card"><span class="info-icon red">${icon("warning",25)}</span><div><b>Осторожно</b><p>${esc(extra.warning || meta[5])}</p></div></div><div class="info-card use-card"><span class="info-icon purple">${icon("info",25)}</span><div><b>Применение</b><p>${esc(extra.use || meta[4])}</p></div></div><div class="detail-footer"><span>Тип: ${code.type}-код</span><span class="safe-badge">${icon("shield",23)}</span></div></aside>`;
}
function bindDetail(root) {
  root.querySelectorAll("[data-detail-star]").forEach(btn => btn.addEventListener("click", () => toggleFavorite(btn.dataset.detailStar)));
  root.querySelectorAll("[data-share]").forEach(btn => btn.addEventListener("click", async () => {
    const c=ALL_CODES.find(x=>x.code===btn.dataset.share); const text=`${c.code}: ${c.title}\n${c.english}`;
    if (navigator.share) await navigator.share({title:`${c.code} — ${c.title}`,text}).catch(()=>{}); else { await navigator.clipboard?.writeText(text); showToast("Код скопирован"); }
  }));
  root.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", closeSheet));
}
function renderDetail() {
  const c=selectedCode(), root=$("#detail-desktop"); root.innerHTML=detailHTML(c); bindDetail(root);
  if (!$("#sheet-backdrop").hidden) { const sheet=$("#detail-sheet"); sheet.innerHTML=detailHTML(c,true); bindDetail(sheet); }
}
function openSheet() { const b=$("#sheet-backdrop"); b.hidden=false; const s=$("#detail-sheet"); s.innerHTML=detailHTML(selectedCode(),true); bindDetail(s); }
function closeSheet() { $("#sheet-backdrop").hidden=true; }

function renderTabs() { $$('[data-tab]').forEach(btn => btn.classList.toggle("active",btn.dataset.tab===state.tab)); }
function render() { renderTabs(); renderCategories(); renderList(); renderDetail(); }
function changeTab(tab) {
  state.tab=tab; state.group="all"; state.query=""; $("#search").value="";
  const first=tab==="M"?M_CODES[0]:tab==="G"?G_CODES[0]:ALL_CODES.find(c=>state.favorites.includes(c.code)); if(first) state.selected=first.code; render();
}

$$('[data-icon]').forEach(el => el.innerHTML=icon(el.dataset.icon, el.closest(".bottom-dock") ? 28 : 21));
$$('[data-tab]').forEach(btn => btn.addEventListener("click",()=>changeTab(btn.dataset.tab)));
$("#focus-search").addEventListener("click",()=>$("#search").focus());
$("#search").addEventListener("input",e=>{state.query=e.target.value;render();});
$("#clear-search").addEventListener("click",()=>{state.query="";$("#search").value="";render();});
$("#sheet-backdrop").addEventListener("click",e=>{if(e.target.id==="sheet-backdrop")closeSheet();});
$$('[data-message]').forEach(btn=>btn.addEventListener("click",()=>showToast(btn.dataset.message)));
$$('[data-module]').forEach(btn=>btn.addEventListener("click",()=>{
  const targetModule=btn.dataset.module;
  const calculations=targetModule==="calculations";
  $("#reference-view").hidden=calculations;
  $("#calculations-view").hidden=!calculations;
  $("#module-title").textContent=calculations?"— Расчёты":"— Справочник кодов";
  $$('.bottom-dock [data-module]').forEach(item=>item.classList.toggle("active",item===btn));
  if(calculations)window.CalculationsModule.mount($("#calculations-root"),{onRouteChange:title=>{$("#module-title").textContent=`— ${title}`;}});
  window.scrollTo({top:0,behavior:"smooth"});
}));
function showToast(message) { const t=$("#toast"); t.textContent=message; t.hidden=false; clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>t.hidden=true,2200); }

$("#voice-search").addEventListener("click",()=>{
  const Speech=window.SpeechRecognition||window.webkitSpeechRecognition; if(!Speech){showToast("Голосовой поиск недоступен в этом браузере");return;}
  const r=new Speech();r.lang="ru-RU";r.onresult=e=>{$("#search").value=e.results[0][0].transcript;state.query=$("#search").value;render();};r.onerror=()=>showToast("Не удалось распознать голос");r.start();
});

const quick=["M03","M05","M08","M10","M11","M75"];
$("#quick-codes").insertAdjacentHTML("beforeend",quick.map(code=>{const c=M_CODES.find(x=>x.code===code);return `<button style="${css(c.group)}" data-quick="${code}">${code}</button>`;}).join(""));
$$('[data-quick]').forEach(btn=>btn.addEventListener("click",()=>{state.tab="M";state.group="all";state.selected=btn.dataset.quick;render();openSheet();}));

function syncOnline(){const on=navigator.onLine;$("#offline-pill").classList.toggle("online",on);$("#offline-label").textContent=on?"Оффлайн готов":"Оффлайн";}
window.addEventListener("online",syncOnline);window.addEventListener("offline",syncOnline);syncOnline();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();
