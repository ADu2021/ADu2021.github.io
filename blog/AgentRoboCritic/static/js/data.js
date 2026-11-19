/*
 * Figure data for index.html (paper: Overleaf checkout 65ebf50).
 * Values come from the paper's tables or from the vector geometry of the paper's own figure
 * PDFs (read from the PDF content streams and independently re-verified); colors are the
 * paper's figure colors. Teaser and Figure 2 slots are PDF-point rectangles of the paper figures.
 */
window.ARC = {
  palette: {
    /* Figure 4 (mechanisms.pdf): stack order and colors; in-segment label colors */
    modes: { grasp: '#3d5fa8', alignment: '#4f78b8', interference: '#6e9bd0', effect: '#85b3e0', incomplete: '#a8d1f3', choice: '#cdeefc', unresolved: '#b8b8b8' },
    modeLabel: { grasp: '#ffffff', alignment: '#ffffff', interference: '#ffffff', effect: '#1a1a1a', incomplete: '#1a1a1a', choice: '#1a1a1a', unresolved: '#1a1a1a' },
    fig4: { axis: '#c3c2b7', tick: '#52514e', label: '#000000', sep: '#ffffff' },
    /* Figure 3 (failure_cases.pdf): tag backgrounds, text #111111 */
    fig3tags: {
      grasp: { bg: '#c7daf0', fg: '#111111' }, alignment: { bg: '#f9d8b6', fg: '#111111' }, interference: { bg: '#f5c4c4', fg: '#111111' },
      effect: { bg: '#cbe6cb', fg: '#111111' }, incomplete: { bg: '#d8d2ee', fg: '#111111' }, choice: { bg: '#c2e4e4', fg: '#111111' }
    },
    /* Figure 6 (zeroshot_comparison.pdf) */
    fig6: { astra: '#3d5fa8', pi05: '#a3a3a3', internw0: '#cbcbcb', success: '#2e7d46', fail: '#c0392b', replan: '#3d5fa8', astraLabel: '#3d5fa8', baseLabel: '#505050', benchTag: '#6b6b6b', ink: '#1a1a1a' },
    /* matplotlib chart chrome shared by Figures 5, 7 and the recovery-by-mode chart */
    chart: { spine: '#404040', tick: '#404040', axisLabel: '#222222', title: '#000000', grid: '#d7d7d7', gridOpacity: 0.6, err: '#333333' }
  },

  /* Teaser tiles in pt of the 495 x 129.5 pt teaser. Each loop is cut from the rollout at the frames
   * matching the paper still (normalized cross-correlation >= 0.996). The four zero-shot tiles are
   * shown in the camera's true orientation (the paper prints these four photos vertically flipped). */
  teaserSlots: [
    { x: 152.367, y: 20.117, w: 37.687, h: 28.266, src: 'static/videos/teaser/recovery_1.mp4', poster: 'static/posters/teaser/recovery_1.jpg', label: 'Misses cap' },
    { x: 192.047, y: 20.117, w: 37.687, h: 28.266, src: 'static/videos/teaser/recovery_2.mp4', poster: 'static/posters/teaser/recovery_2.jpg', label: 'Reopens' },
    { x: 152.367, y: 50.376, w: 37.687, h: 28.266, src: 'static/videos/teaser/recovery_3.mp4', poster: 'static/posters/teaser/recovery_3.jpg', label: 'Regrasps' },
    { x: 192.047, y: 50.376, w: 37.687, h: 28.266, src: 'static/videos/teaser/recovery_4.mp4', poster: 'static/posters/teaser/recovery_4.jpg', label: 'Cap is off' },
    { x: 235.214, y: 20.117, w: 37.687, h: 28.266, src: 'static/videos/teaser/grounding_1.mp4', poster: 'static/posters/teaser/grounding_1.jpg', label: 'Observes colors' },
    { x: 274.894, y: 20.117, w: 37.687, h: 28.266, src: 'static/videos/teaser/grounding_2.mp4', poster: 'static/posters/teaser/grounding_2.jpg', label: 'All covered' },
    { x: 235.214, y: 50.376, w: 37.687, h: 28.266, src: 'static/videos/teaser/grounding_3.mp4', poster: 'static/posters/teaser/grounding_3.jpg', label: 'Uncovers red' },
    { x: 274.894, y: 50.376, w: 37.687, h: 28.266, src: 'static/videos/teaser/grounding_4.mp4', poster: 'static/posters/teaser/grounding_4.jpg', label: 'Then green' },
    { x: 318.061, y: 20.117, w: 37.688, h: 28.266, src: 'static/videos/teaser/zeroshot_1.mp4', poster: 'static/posters/teaser/zeroshot_1.jpg', label: 'RoboTwin 2.0, full episode' },
    { x: 357.741, y: 20.117, w: 37.688, h: 28.266, src: 'static/videos/teaser/zeroshot_2.mp4', poster: 'static/posters/teaser/zeroshot_2.jpg', label: 'Stacked' },
    { x: 318.061, y: 50.376, w: 37.687, h: 28.266, src: 'static/videos/teaser/zeroshot_3.mp4', poster: 'static/posters/teaser/zeroshot_3.jpg', label: 'YAMLab, full episode' },
    { x: 357.741, y: 50.376, w: 37.687, h: 28.266, src: 'static/videos/teaser/zeroshot_4.mp4', poster: 'static/posters/teaser/zeroshot_4.jpg', label: 'Mug hung' }
  ],
  /* Teaser panels in pt (the panel frames of the paper figure plus 0.4 pt for their stroke): each links to
   * the section that discusses it and enlarges on hover. */
  teaserPanels: [
    { x: 0.85, y: 0, w: 143.65, h: 129.1, href: '#evaluation', title: 'Go to Evaluating Robot Execution',
      label: 'Panel (a), intent-grounded action-level critique. Go to Evaluating Robot Execution.' },
    { x: 147.28, y: 0, w: 253.23, h: 129.1, href: '#capabilities', title: 'Go to Capabilities of Frontier Agents',
      label: 'Panel (b), capabilities of frontier agents on direct robot control, shown with rollout clips. Go to the Capabilities section.' },
    { x: 403.3, y: 0, w: 90.85, h: 129.1, href: '#critics', title: 'Go to Reliability of the Critic',
      label: 'Panel (c), failure-mode accuracy of critics on the human-labeled benchmark. Go to Reliability of the Critic.' }
  ],
  /* Figure 2: the observation image of panel (1) (494.994 x 149.998 pt), head camera */
  pipelineSlots: [
    { x: 5.20, y: 44.78, w: 58.00, h: 32.62, src: 'static/videos/fig2/observation.mp4', poster: 'static/posters/fig2/observation.jpg', label: 'Rollout of RoboDojo-Precision deposit_coin, call 13 and the lift check' }
  ],

  /* Figure 3: one failed action per mode, text verbatim from the paper figure; clips cropped to the
   * paper's framing. Effect ends at the paper's last frame (the box later settles upright). The
   * "Reference pose" frame of Incomplete Motion is the episode start and is not part of the clip. */
  fig3: [
    { id: 'grasp', tag: 'Grasp', desc: 'Object acquisition and retention', steps: ['Doll in fingers', 'Starts to slip', 'Empty fingers'], intent: 'Lift the small doll clear of the table.', src: 'static/videos/fig3/grasp.mp4', poster: 'static/posters/fig3/grasp.jpg', ar: '536 / 390' },
    { id: 'alignment', tag: 'Alignment', desc: 'Spatial targeting and engagement', steps: ['Spoon above mug', 'Released at rim', 'Lands outside'], intent: 'Release the utensil into the mug.', src: 'static/videos/fig3/alignment.mp4', poster: 'static/posters/fig3/alignment.jpg', ar: '480 / 348' },
    { id: 'interference', tag: 'Interference', desc: 'Unintended collision and disturbance', steps: ['Can upright', 'Fingertip tips it', 'Can on its side'], intent: 'Finish positioning the left hand for the green toy.', src: 'static/videos/fig3/interference.mp4', poster: 'static/posters/fig3/interference.jpg', ar: '640 / 464' },
    { id: 'effect', tag: 'Effect', desc: 'Task-effect execution', steps: ['Fingertips at edge', 'Hand pushes', 'Box still tipped'], intent: 'Push the raised edge to roll the box onto its base.', src: 'static/videos/fig3/effect.mp4', poster: 'static/posters/fig3/effect.jpg', ar: '330 / 240' },
    { id: 'incomplete', tag: 'Incomplete Motion', desc: 'Premature termination and reset', steps: ['Return starts', 'Stops over bin'], intent: 'Return the left arm to its initial open-gripper pose.', src: 'static/videos/fig3/incomplete_motion.mp4', poster: 'static/posters/fig3/incomplete_motion.jpg', ar: '640 / 464' },
    { id: 'choice', tag: 'Choice', desc: 'Local target or relation selection', steps: ['White is target', 'Moves to cola', 'Cola in jaws'], intent: 'Approach the upright white bottle.', src: 'static/videos/fig3/choice.mp4', poster: 'static/posters/fig3/choice.jpg', ar: '640 / 464' }
  ],

  /* Figure 6 (b): paired rollouts, captions and badges verbatim from the paper figure */
  fig6: {
    tasks: [
      { title: 'Stack three blocks', bench: 'RoboTwin 2.0', ar: '320 / 212',
        astra: { src: 'static/videos/fig6/robotwin_astra.mp4', poster: 'static/posters/fig6/robotwin_astra.jpg', ok: true, badge: 'Success', rate: '91', steps: ['Initial', '↻ Re-plan hover', 'Stacked'] },
        base: { src: 'static/videos/fig6/robotwin_pi05.mp4', poster: 'static/posters/fig6/robotwin_pi05.jpg', ok: false, badge: 'Timeout', rate: '6', steps: ['Initial', 'Hits blocks', 'No stack'] } },
      { title: 'Hand over and hang a mug', bench: 'YAMLab', ar: '560 / 372',
        astra: { src: 'static/videos/fig6/yamlab_astra.mp4', poster: 'static/posters/fig6/yamlab_astra.jpg', ok: true, badge: 'Success', rate: '90', steps: ['Initial', 'Handover', '↻ Joint re-plan'] },
        base: { src: 'static/videos/fig6/yamlab_pi05.mp4', poster: 'static/posters/fig6/yamlab_pi05.jpg', ok: false, badge: 'Object fell', rate: '0', steps: ['Initial', 'Mug knocked over', 'Mug off table'] } }
    ]
  },



  /* Figure 6 (a): zero-shot episode success (%); bars drawn at the geometry values, labels as printed */
  zeroShot: {
    policies: [{ id: 'astra', name: 'GPT-6 Astra' }, { id: 'pi05', name: 'π0.5' }, { id: 'internw0', name: 'InternW0-Δ' }],
    benchmarks: [
      { name: 'RoboTwin 2.0', v: { astra: 91.49, pi05: 6.4, internw0: 0 }, printed: { astra: '91', pi05: '6', internw0: '0' } },
      { name: 'YAMLab', v: { astra: 90, pi05: 0, internw0: 0 }, printed: { astra: '90', pi05: '0', internw0: '0' } }
    ]
  },

  /* Figure 4: failure modes of failed actions per benchmark, % of n (tab:supp_mechanisms; the figure
   * draws the same shares at one more decimal). '<1' as printed; null = not assessed (archival). */
  mechanisms: [
    { name: 'RoboDojo-Precision',      mark: '', n: 1500, v: { grasp: 63, alignment: 17, interference: 15, effect: 2,    incomplete: 4,  unresolved: 0, choice: null } },
    { name: 'RoboDojo-Open',           mark: '',       n: 1489, v: { grasp: 68, alignment: 9,  interference: 16, effect: 4,    incomplete: 3,  unresolved: 0, choice: 0 } },
    { name: 'RoboDojo-Long-horizon',   mark: '',       n: 2586, v: { grasp: 49, alignment: 20, interference: 26, effect: 1,    incomplete: 4,  unresolved: 0, choice: '<1' } },
    { name: 'RoboDojo-Generalization', mark: '',       n: 3646, v: { grasp: 47, alignment: 15, interference: 32, effect: 4,    incomplete: 2,  unresolved: 0, choice: '<1' } },
    { name: 'RoboDojo-Memory',         mark: '',       n: 938,  v: { grasp: 67, alignment: 5,  interference: 27, effect: '<1', incomplete: 1,  unresolved: 0, choice: 0 } },
    { name: 'StationeryBench',         mark: '',       n: 411,  v: { grasp: 42, alignment: 7,  interference: 17, effect: 1,    incomplete: 33, unresolved: 0, choice: 0 } },
    { name: 'Astranomy',               mark: '',       n: 869,  v: { grasp: 77, alignment: 9,  interference: 4,  effect: 0,    incomplete: 11, unresolved: 0, choice: 0 } },
    { name: 'UniVTAC',                 mark: '*',      n: 110,  v: { grasp: 25, alignment: 75, interference: 0,  effect: 0,    incomplete: 0,  unresolved: 0, choice: 0 } },
    { name: 'OpenViTac',               mark: '*',      n: 164,  v: { grasp: 10, alignment: 86, interference: 3,  effect: 1,    incomplete: 0,  unresolved: 0, choice: 0 } },
    { name: 'ContactBench 1.0',        mark: '',       n: 75,   v: { grasp: 71, alignment: 13, interference: 3,  effect: 4,    incomplete: 9,  unresolved: 0, choice: 0 } },
    { name: 'LIBERO-MAX',              mark: '',       n: 273,  v: { grasp: 23, alignment: 14, interference: 3,  effect: '<1', incomplete: 57, unresolved: 0, choice: 3 } },
    { name: 'Meta-World+',             mark: '',       n: 63,   v: { grasp: 41, alignment: 19, interference: 30, effect: 5,    incomplete: 5,  unresolved: 0, choice: 0 } },
    { name: 'DexJoCo',                 mark: '',       n: 103,  v: { grasp: 52, alignment: 25, interference: 7,  effect: 3,    incomplete: 11, unresolved: 2, choice: 0 } },
    { name: 'RoboWits',                mark: '',       n: 94,   v: { grasp: 64, alignment: 11, interference: 17, effect: 3,    incomplete: 4,  unresolved: 1, choice: 0 } },
    { name: 'RoboTwin 2.0',            mark: '',       n: 54,   v: { grasp: 39, alignment: 22, interference: 24, effect: 0,    incomplete: 15, unresolved: 0, choice: 0 } },
    { name: 'YAMLab',                  mark: '',       n: 62,   v: { grasp: 87, alignment: 8,  interference: 3,  effect: 0,    incomplete: 0,  unresolved: 2, choice: 0 } }
  ],

  /* Figure 5 (recoverability_benchmarks.pdf), values read from the figure geometry; intervals are
   * Wilson 95% (the Overall series of (c) is drawn as a band). */
  fig5: {
    series: {
      overall:   { name: 'Overall',    color: '#1f2f57', marker: 'circle',   dash: '8.8 4.4', width: 2.2 },
      robodojo:  { name: 'RoboDojo',   color: '#3d5fa8', marker: 'square',   width: 1.9 },
      openvitac: { name: 'OpenViTac',  color: '#6e9bd0', marker: 'diamond',  width: 1.9 },
      liberomax: { name: 'LIBERO-MAX', color: '#93c0ea', marker: 'triangle', width: 1.9 }
    },
    barOpacity: 0.88,
    a: { overall: { v: 49.8, lo: 46.5, hi: 53.1 }, robodojo: { v: 61.7, lo: 57.2, hi: 66.1 }, openvitac: { v: 23.1, lo: 16.0, hi: 32.0 }, liberomax: { v: 47.6, lo: 35.8, hi: 59.7 } },
    b: { x: ['0', '1–2', '3+'], series: {
      overall:   [{ v: 75.1, lo: 71.5, hi: 78.5 }, { v: 40.3, lo: 36.5, hi: 44.2 }, { v: 13.3, lo: 11.6, hi: 15.3 }],
      robodojo:  [{ v: 62.7, lo: 56.8, hi: 68.2 }, { v: 33.8, lo: 29.8, hi: 38.0 }, { v: 9.4, lo: 7.8, hi: 11.2 }],
      openvitac: [{ v: 90.9, lo: 83.1, hi: 95.3 }, { v: 68.8, lo: 44.4, hi: 85.8 }, { v: 50.0, lo: 32.1, hi: 67.9 }],
      liberomax: [{ v: 100.0, lo: 89.6, hi: 100.0 }, { v: 100.0, lo: 79.6, hi: 100.0 }, { v: 93.8, lo: 71.7, hi: 98.9 }] } },
    c: { x: [1, 3, 10, 30, 100, 'end'], ref: { x: 10, y: 38.9 },
      series: {
        overall:   [{ v: 3.1 }, { v: 10.4 }, { v: 38.9 }, { v: 53.4 }, { v: 57.2 }, { v: 57.7 }],
        robodojo:  [{ v: 2.9, lo: 2.6, hi: 3.3 }, { v: 10.5, lo: 9.9, hi: 11.1 }, { v: 41.0, lo: 40.0, hi: 42.0 }, { v: 54.9, lo: 53.9, hi: 55.8 }, { v: 56.9, lo: 55.9, hi: 57.9 }, { v: 56.9, lo: 55.9, hi: 57.9 }],
        openvitac: [{ v: 2.4, lo: 1.0, hi: 6.1 }, { v: 12.2, lo: 8.0, hi: 18.1 }, { v: 40.2, lo: 33.0, hi: 47.9 }, { v: 62.2, lo: 54.6, hi: 69.3 }, { v: 65.9, lo: 58.3, hi: 72.7 }, { v: 65.9, lo: 58.3, hi: 72.7 }],
        liberomax: [{ v: 2.9, lo: 1.5, hi: 5.7 }, { v: 8.1, lo: 5.4, hi: 11.9 }, { v: 17.9, lo: 13.9, hi: 22.9 }, { v: 47.3, lo: 41.4, hi: 53.2 }, { v: 86.1, lo: 81.5, hi: 89.7 }, { v: 99.6, lo: 98.0, hi: 99.9 }]
      },
      band: { overall: [{ lo: 2.8, hi: 3.4 }, { lo: 9.9, hi: 11.0 }, { lo: 38.1, hi: 39.8 }, { lo: 52.5, hi: 54.3 }, { lo: 56.3, hi: 58.1 }, { lo: 56.9, hi: 58.6 }] },
      bandOpacity: 0.1
    },
    d: {
      xMin: 10, xMax: 105, yMin: -6, yMax: 108, xTicks: [25, 50, 75, 100], yTicks: [0, 25, 50, 75, 100], r: 0.81,
      pointColor: '#a3b3cb', fitColor: '#6b6b6b',
      fit: { x0: 17.4, y0: 14.7, x1: 99.6, y1: 88.8 },
      points: [
        { name: 'UniVTAC', x: 17.4, y: 41.7 }, { name: 'StationeryBench', x: 31.6, y: 7.0 }, { name: 'ContactBench 1.0', x: 42.1, y: 45.5 },
        { name: 'RoboDojo', x: 56.9, y: 16.8, series: 'robodojo' }, { name: 'RoboTwin 2.0', x: 59.3, y: 71.4 }, { name: 'Astranomy', x: 62.9, y: 49.0 },
        { name: 'RoboWits', x: 63.8, y: 44.4 }, { name: 'OpenViTac', x: 65.9, y: 57.1, series: 'openvitac' }, { name: 'DexJoCo', x: 69.9, y: 63.6 },
        { name: 'YAMLab', x: 96.8, y: 88.9 }, { name: 'Meta-World+', x: 98.4, y: 95.0 }, { name: 'LIBERO-MAX', x: 99.6, y: 96.8, series: 'liberomax' }
      ]
    }
  },

  /* Figure 7 (failure_analysis.pdf): (a) recovered k of n by the end of the episode with Wilson 95%
   * intervals; (b) Grasp sub-categories. Bars at fill opacity 0.92. */
  fig7: {
    barOpacity: 0.92,
    a: [
      { name: 'Effect', k: 87, n: 294, v: 29.6, lo: 24.66, hi: 35.05, color: '#85b3e0' },
      { name: 'Alignment', k: 681, n: 1908, v: 35.7, lo: 33.57, hi: 37.87, color: '#4f78b8' },
      { name: 'Interference', k: 1602, n: 2711, v: 59.1, lo: 57.23, hi: 60.93, color: '#6e9bd0' },
      { name: 'Grasp', k: 4155, n: 6523, v: 63.7, lo: 62.52, hi: 64.86, color: '#3d5fa8' },
      { name: 'Incomplete motion', k: 479, n: 702, v: 68.2, lo: 64.70, hi: 71.57, color: '#a8d1f3' }
    ],
    bColor: '#3d5fa8', bracket: '#6b6b6b', bMax: 37,
    b: [
      { stage: 'At closure', items: [
        { name: 'Pinch on a rim, tip, or edge', v: 25.7 }, { name: 'Closure beside the object', v: 18.8 },
        { name: 'Closure above the object', v: 10.2 }, { name: 'Other closure errors', v: 6.7 } ] },
      { stage: 'After capture', items: [
        { name: 'Loss during carry', v: 13.6 }, { name: 'Loss during the first lift', v: 4.9 },
        { name: 'Failed handover or release', v: 1.5 } ] },
      { stage: 'Other', items: [
        { name: 'Action with an empty gripper', v: 9.5 }, { name: 'Unresolved contact', v: 9.1 } ] }
    ]
  },

  /* Recovery over actions by failure mode (recovery_modes.pdf), y = 100 k / n at each x */
  recoveryModes: {
    x: [1, 3, 10, 30, 100, 'end'], xLabel: 'Actions after failure', yLabel: 'Failures recovered (%)', yMax: 100, yTicks: [0, 25, 50, 75, 100],
    series: [
      { name: 'Incomplete motion', color: '#a8d1f3', marker: 'triangle', y: [10.5, 24.9, 42.5, 49.7, 63.2, 68.2] },
      { name: 'Grasp', color: '#3d5fa8', marker: 'circle', y: [0.2, 2.2, 40.4, 59.3, 63.2, 63.7] },
      { name: 'Interference', color: '#6e9bd0', marker: 'diamond', y: [8.3, 27.0, 47.2, 57.3, 59.1, 59.1] },
      { name: 'Alignment', color: '#4f78b8', marker: 'square', y: [3.2, 9.8, 23.1, 32.8, 35.6, 35.7] },
      { name: 'Effect', color: '#85b3e0', marker: 'triangle-down', y: [1.4, 10.5, 24.8, 29.3, 29.6, 29.6] },
      { name: 'All failure modes', color: '#1f2f57', marker: 'circle', dash: '8.8 4.4', y: [3.1, 10.4, 38.9, 53.4, 57.2, 57.7] }
    ]
  },

  /* Per-benchmark recovery statistics (tab:supp_recovery and tab:supp_macro), with the paper's cell shading;
   * shown beside Figure 5(d) for the selected benchmark. */
  recoveryStats: {
  rows: {
    "RoboDojo": {"mark": "", "failures": "9,923", "episodes": "1,659", "succ": {"v": "17", "bg": "#c8e0f6", "fg": "#111111"}, "withFail": {"v": "62", "bg": "#577fbd", "fg": "#ffffff"}, "none": {"v": "63", "bg": "#557dbc", "fg": "#ffffff"}, "oneTwo": {"v": "34", "bg": "#9dc7ec", "fg": "#111111"}, "threePlus": {"v": "9", "bg": "#dae9f8", "fg": "#111111"}, "within10": {"v": "41", "bg": "#88b3e0", "fg": "#111111"}, "byEnd": {"v": "57", "bg": "#608ac5", "fg": "#ffffff"}},
    "StationeryBench": {"mark": "", "failures": "411", "episodes": "100", "succ": {"v": "7", "bg": "#deebf9", "fg": "#111111"}, "withFail": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "none": {"v": "–", "bg": "#ececec", "fg": "#111111"}, "oneTwo": {"v": "27", "bg": "#b0d5f4", "fg": "#111111"}, "threePlus": {"v": "4", "bg": "#e4eefa", "fg": "#111111"}, "within10": {"v": "31", "bg": "#a5cff1", "fg": "#111111"}, "byEnd": {"v": "32", "bg": "#a3cdf0", "fg": "#111111"}},
    "Astranomy": {"mark": "", "failures": "869", "episodes": "49", "succ": {"v": "49", "bg": "#719ed2", "fg": "#ffffff"}, "withFail": {"v": "83", "bg": "#34508f", "fg": "#ffffff"}, "none": {"v": "71", "bg": "#4468ae", "fg": "#ffffff"}, "oneTwo": {"v": "75", "bg": "#3d5fa8", "fg": "#ffffff"}, "threePlus": {"v": "44", "bg": "#80abdb", "fg": "#111111"}, "within10": {"v": "25", "bg": "#b5d7f4", "fg": "#111111"}, "byEnd": {"v": "63", "bg": "#557cbb", "fg": "#ffffff"}},
    "UniVTAC": {"mark": "*", "failures": "109", "episodes": "12", "succ": {"v": "42", "bg": "#86b2df", "fg": "#111111"}, "withFail": {"v": "8", "bg": "#dceaf8", "fg": "#111111"}, "none": {"v": "82", "bg": "#345191", "fg": "#ffffff"}, "oneTwo": {"v": "50", "bg": "#6e9bd0", "fg": "#ffffff"}, "threePlus": {"v": "40", "bg": "#8bb6e2", "fg": "#111111"}, "within10": {"v": "15", "bg": "#cee3f7", "fg": "#111111"}, "byEnd": {"v": "17", "bg": "#c7dff6", "fg": "#111111"}},
    "OpenViTac": {"mark": "*", "failures": "164", "episodes": "42", "succ": {"v": "57", "bg": "#608ac5", "fg": "#ffffff"}, "withFail": {"v": "23", "bg": "#b9d9f5", "fg": "#111111"}, "none": {"v": "91", "bg": "#2a4074", "fg": "#ffffff"}, "oneTwo": {"v": "69", "bg": "#496eb2", "fg": "#ffffff"}, "threePlus": {"v": "50", "bg": "#6e9bd0", "fg": "#ffffff"}, "within10": {"v": "40", "bg": "#8ab5e1", "fg": "#111111"}, "byEnd": {"v": "66", "bg": "#4f75b7", "fg": "#ffffff"}},
    "ContactBench 1.0": {"mark": "", "failures": "38", "episodes": "33", "succ": {"v": "45", "bg": "#7ba7d8", "fg": "#111111"}, "withFail": {"v": "44", "bg": "#7fabda", "fg": "#111111"}, "none": {"v": "50", "bg": "#6e9bd0", "fg": "#ffffff"}, "oneTwo": {"v": "54", "bg": "#6692ca", "fg": "#ffffff"}, "threePlus": {"v": "14", "bg": "#cee3f7", "fg": "#111111"}, "within10": {"v": "34", "bg": "#9cc6ec", "fg": "#111111"}, "byEnd": {"v": "42", "bg": "#85b0de", "fg": "#111111"}},
    "LIBERO-MAX": {"mark": "", "failures": "273", "episodes": "31", "succ": {"v": "97", "bg": "#233561", "fg": "#ffffff"}, "withFail": {"v": "48", "bg": "#75a1d4", "fg": "#ffffff"}, "none": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "oneTwo": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "threePlus": {"v": "94", "bg": "#263b6b", "fg": "#ffffff"}, "within10": {"v": "18", "bg": "#c6dff6", "fg": "#111111"}, "byEnd": {"v": "100", "bg": "#1f3058", "fg": "#ffffff"}},
    "Meta-World+": {"mark": "", "failures": "63", "episodes": "20", "succ": {"v": "95", "bg": "#253967", "fg": "#ffffff"}, "withFail": {"v": "39", "bg": "#8fb9e4", "fg": "#111111"}, "none": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "oneTwo": {"v": "92", "bg": "#283e70", "fg": "#ffffff"}, "threePlus": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "within10": {"v": "73", "bg": "#4164ab", "fg": "#ffffff"}, "byEnd": {"v": "98", "bg": "#21325c", "fg": "#ffffff"}},
    "DexJoCo": {"mark": "", "failures": "103", "episodes": "11", "succ": {"v": "64", "bg": "#537aba", "fg": "#ffffff"}, "withFail": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "none": {"v": "–", "bg": "#ececec", "fg": "#111111"}, "oneTwo": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "threePlus": {"v": "50", "bg": "#6e9bd0", "fg": "#ffffff"}, "within10": {"v": "38", "bg": "#91bce5", "fg": "#111111"}, "byEnd": {"v": "70", "bg": "#476bb0", "fg": "#ffffff"}},
    "RoboWits": {"mark": "", "failures": "94", "episodes": "9", "succ": {"v": "44", "bg": "#7eaada", "fg": "#111111"}, "withFail": {"v": "40", "bg": "#8bb6e2", "fg": "#111111"}, "none": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "oneTwo": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "threePlus": {"v": "38", "bg": "#92bde6", "fg": "#111111"}, "within10": {"v": "41", "bg": "#87b2df", "fg": "#111111"}, "byEnd": {"v": "64", "bg": "#537aba", "fg": "#ffffff"}},
    "RoboTwin 2.0": {"mark": "", "failures": "54", "episodes": "14", "succ": {"v": "71", "bg": "#4468ae", "fg": "#ffffff"}, "withFail": {"v": "23", "bg": "#b9d9f5", "fg": "#111111"}, "none": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "oneTwo": {"v": "89", "bg": "#2c447b", "fg": "#ffffff"}, "threePlus": {"v": "40", "bg": "#8bb6e2", "fg": "#111111"}, "within10": {"v": "48", "bg": "#73a0d3", "fg": "#ffffff"}, "byEnd": {"v": "59", "bg": "#5c85c1", "fg": "#ffffff"}},
    "YAMLab": {"mark": "", "failures": "62", "episodes": "9", "succ": {"v": "89", "bg": "#2c447b", "fg": "#ffffff"}, "withFail": {"v": "89", "bg": "#2c447b", "fg": "#ffffff"}, "none": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "oneTwo": {"v": "75", "bg": "#3d5fa8", "fg": "#ffffff"}, "threePlus": {"v": "100", "bg": "#1f2f57", "fg": "#ffffff"}, "within10": {"v": "48", "bg": "#739fd3", "fg": "#ffffff"}, "byEnd": {"v": "97", "bg": "#233561", "fg": "#ffffff"}}
  },
  combined: {"withFail": {"v": "49.8"}, "none": {"v": "75.1"}, "oneTwo": {"v": "40.3"}, "threePlus": {"v": "13.3"}, "within10": {"v": "38.9"}, "byEnd": {"v": "57.7"}, "failures": "12,163", "episodes": "1,989"},
  average: {"withFail": {"v": "54.9"}, "none": {"v": "85.7"}, "oneTwo": {"v": "72.0"}, "threePlus": {"v": "48.5"}, "within10": {"v": "37.7"}, "byEnd": {"v": "63.7"}}
  },

  /* Benchmark carousel (Dataset and Release): a typical task rollout or environment image per benchmark,
   * cropped to 2:1. Taken from each project page's own rollout videos, posters or task figures; RoboDojo,
   * StationeryBench and YAMLab use frames of our own rollouts from the paper. */
  covers: [
    { name: 'RoboDojo', img: 'static/img/benchmarks/robodojo.jpg', w: 640, h: 320, url: 'https://robodojo-benchmark.com/' },
    { name: 'StationeryBench', img: 'static/img/benchmarks/stationerybench.jpg', w: 720, h: 360, url: 'https://robocurve.github.io/stationerybench/' },
    { name: 'Astranomy', img: 'static/img/benchmarks/astranomy.jpg', w: 640, h: 320, url: 'https://research.nvidia.com/labs/srl/projects/astranomy/' },
    { name: 'UniVTAC', img: 'static/img/benchmarks/univtac.jpg', w: 560, h: 280, url: 'https://univtac.github.io/' },
    { name: 'OpenViTac', img: 'static/img/benchmarks/openvitac.jpg', w: 720, h: 360, url: 'https://fvl-repo.github.io/OpenViTac/' },
    { name: 'ContactBench 1.0', img: 'static/img/benchmarks/contactbench.jpg', w: 640, h: 320, url: 'https://jingyi-xiang.github.io/contactbench/' },
    { name: 'LIBERO-MAX', img: 'static/img/benchmarks/liberomax.jpg', w: 640, h: 320, url: 'https://liberomax.github.io/' },
    { name: 'Meta-World+', img: 'static/img/benchmarks/metaworldplus.jpg', w: 444, h: 222, url: 'https://metaworld.farama.org/' },
    { name: 'DexJoCo', img: 'static/img/benchmarks/dexjoco.jpg', w: 720, h: 360, url: 'https://dexjoco.github.io/' },
    { name: 'RoboWits', img: 'static/img/benchmarks/robowits.jpg', w: 720, h: 360, url: 'https://umass-embodied-agi.github.io/RoboWits/' },
    { name: 'RoboTwin 2.0', img: 'static/img/benchmarks/robotwin2.jpg', w: 720, h: 360, url: 'https://robotwin-platform.github.io/' },
    { name: 'YAMLab', img: 'static/img/benchmarks/yamlab.jpg', w: 640, h: 320, url: 'https://github.com/ARISE-Initiative/yamlab' }
  ]
};
