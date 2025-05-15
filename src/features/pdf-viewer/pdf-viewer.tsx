import { useEffect, useRef } from 'react';
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer';
import { usePdfViewerInstance } from '@/features/pdf-viewer/pdf-viewer-hook';

function PdfViewer() {
  const path = '/lib/webviewer';
  const licenseKey =
    'demo:1744730630292:610dc9bb0300000000aa0ed34588c67b5ce278a20f9109a9f8b0e1c37b';
  const initialDoc = 'demo-annotated_with-image.pdf';

  const viewer = useRef(null);
  const hasInitialised = useRef(false);
  const { setInstance } = usePdfViewerInstance();

  useEffect(() => {
    // Necessary for strict mode, as the WebViewer would otherwise be initialized twice!
    if (hasInitialised.current) return;
    hasInitialised.current = true;

    WebViewer(
      {
        path,
        licenseKey,
        initialDoc,
        fullAPI: true,
      },
      viewer.current!
    ).then(async instance => {
      instance.UI.enableFeatures([
        instance.UI.Feature.FilePicker,
        instance.UI.Feature.ContentEdit,
        instance.UI.Feature.WatermarkPanel, // Are watermarks only available programatically
        instance.UI.Feature.WatermarkPanelImageTab,
      ]);

      setInstance(instance);

      // ModularHeaderExample(instance); // Does not work
      // ModularRibbonExamlple(instance); // Works but I get a Typescript Error

      instance.Core.documentViewer.addEventListener('documentLoaded', () => {
        ImageExtractionExample(instance); // Does not work
      });
    });
  }, [licenseKey, initialDoc, viewer, setInstance]);

  return <div className="webviewer h-full flex-1 box-border" ref={viewer} />;
}

export default PdfViewer;

function ModularHeaderExample(instance: WebViewerInstance) {
  // Documentation: https://docs.apryse.com/web/guides/modular-ui/containers#modular-header
  // Example does not work. The ModularHeader class does not accept stroke and dimension properties.
  // Additionaly the following error is thrown in the MainMenu class: Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'additionalItems')
  // Additionaly the following error is thrown in the Zoom class: Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'dataElement')
  // The errors causes rendering of the default ui

  const { UI, Core } = instance;
  const { Tools } = Core;

  const mainMenu = new UI.Components.MainMenu();
  const viewControlsToggle = new UI.Components.ViewControls();
  const zoomControls = new UI.Components.Zoom();
  const panToolButton = new UI.Components.ToolButton({
    dataElement: 'panToolButton',
    toolName: Tools.ToolNames.PAN,
  });

  const topHeader = new instance.UI.Components.ModularHeader({
    dataElement: 'default-top-header',
    placement: 'top',
    grow: 0,
    gap: 12,
    position: 'start',
    stroke: true,
    dimension: {
      paddingTop: 8,
      paddingBottom: 8,
      borderWidth: 1,
    },
    style: {},
    items: [mainMenu, viewControlsToggle, zoomControls, panToolButton],
  });

  instance.UI.setModularHeaders([topHeader]);
}

function ModularRibbonExamlple(instance: WebViewerInstance) {
  // Documentation: https://docs.apryse.com/web/guides/modular-ui/containers#ribbon-group-methods
  // Example works but I get a Typescript error for the groupedItems: Type 'string' is not assignable to type 'Item'.
  // See textRibbonItem and shapeRibbonItem

  const { Tools } = instance.Core;
  const highlightToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'my-highlightToolButton',
    toolName: Tools.ToolNames.HIGHLIGHT,
  });

  const freeTextToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'my-freeTextToolButton',
    toolName: Tools.ToolNames.FREETEXT,
  });

  const rectangleToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'my-rectangleToolButton',
    toolName: Tools.ToolNames.RECTANGLE,
  });

  const polylineToolButton = new instance.UI.Components.ToolButton({
    dataElement: 'my-polylineToolButton',
    toolName: Tools.ToolNames.POLYLINE,
  });

  const textToolsGroupedItems = new instance.UI.Components.GroupedItems({
    dataElement: 'textToolsGroupedItems',
    items: [freeTextToolButton, highlightToolButton],
  });

  const shapeToolsGroupedItems = new instance.UI.Components.GroupedItems({
    dataElement: 'shapeToolsGroupedItems',
    style: {},
    items: [rectangleToolButton, polylineToolButton],
  });

  const textRibbonItem = new instance.UI.Components.RibbonItem({
    dataElement: 'textRibbonItem',
    label: 'Text Tools',
    img: 'icon-tool-text-free-text',
    groupedItems: ['textToolsGroupedItems'],
  });

  const shapeRibbonItem = new instance.UI.Components.RibbonItem({
    dataElement: 'shapeRibbonItem',
    label: 'Shape Tools',
    img: 'icon-tool-shape-rectangle',
    groupedItems: ['shapeToolsGroupedItems'],
  });

  const ribbonGroup = new instance.UI.Components.RibbonGroup({
    dataElement: 'my-ribbon-group',
    items: [textRibbonItem, shapeRibbonItem],
  });

  const topHeader = instance.UI.getModularHeader('default-top-header');
  topHeader.setItems([ribbonGroup]);
  topHeader.setJustifyContent('center');

  const toolsHeader = instance.UI.getModularHeader('tools-header');
  toolsHeader.setItems([textToolsGroupedItems, shapeToolsGroupedItems]);
}

async function ImageExtractionExample(instance: WebViewerInstance) {
  // Documentation: https://docs.apryse.com/web/guides/extraction/image-extract
  // Trying to extract images causes an error: Uncaught RuntimeError: table index is out of bounds

  const { PDFNet } = instance.Core;
  await PDFNet.initialize();

  const doc = await instance.Core.documentViewer.getDocument().getPDFDoc();
  const reader = await PDFNet.ElementReader.create();

  const itr = await doc.getPageIterator();
  for (itr; await itr.hasNext(); itr.next()) {
    const page = await itr.current();
    reader.beginOnPage(page);
    await ProcessElements(reader);
    reader.end();
  }

  async function ProcessElements(
    reader: InstanceType<typeof PDFNet.ElementReader>
  ) {
    for (
      let element = await reader.next();
      element !== null;
      element = await reader.next()
    ) {
      const elementType = await element.getType();

      if (elementType === PDFNet.Element.Type.e_image) {
        const image = await PDFNet.Image.createFromObj(
          await element.getXObject()
        );

        // Do something with the image
        console.log(image);
      }
    }
  }
}
