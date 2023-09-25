import {
    initializeBlock,
    useBase,
    useRecords,
} from '@airtable/blocks/ui';
import React from 'react';
import JSZip from 'jszip';

function MerkelappGenerator() {
    const base = useBase();
    const table = base.getTableByNameIfExists("Installasjon")
    const qrFieldId = "fldqHRKfnOo4TGxxR"
    const records = useRecords(table);

    function canvasGenerator() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous"

        // Set canvas size to match the image dimensions
        canvas.width = 600;
        canvas.height = 700;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        return {canvas, context, img};
    }

    function bildeOgTekstGenerator(context, img, record, canvas) {
        context.drawImage(img, 0, 0, 600, 600);

        // Add the Record Name text below the image
        context.font = '8em Arial'; // Set font size and type
        context.fillStyle = 'black'; // Set text color
        context.textAlign = 'center';
        context.fillText(record.name, canvas.width / 2, 665); // Adjust Y-coordinate as needed
    }

    const lastNedSiglePNG = (record) => {
        const {canvas, context, img} = canvasGenerator();

        img.onload = () => {
            bildeOgTekstGenerator(context, img, record, canvas);

            // Create a download link for the image
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = `${record.name}.png`; // Use record.name as the filename
            a.click();
        };

        img.src = record.getCellValue(qrFieldId)[0].url;
    };

    const lastNedZipArkiv = async () => {
        const zip = new JSZip();

        const promises = records.map(async (record) => {
            const {canvas, context, img} = canvasGenerator();

            img.src = record.getCellValue(qrFieldId)[0].url;

            return new Promise((resolve, reject) => {
                img.onload = () => {
                    bildeOgTekstGenerator(context, img, record, canvas);

                    // Convert the canvas to a blob
                    canvas.toBlob((blob) => {
                        if (blob) {
                            // Add the blob to the zip file with the record name as the filename
                            zip.file(`${record.name}.png`, blob);
                            resolve();
                        } else {
                            reject(`Error converting canvas to blob for ${record.name}`);
                        }
                    }, 'image/png');
                };

                img.onerror = () => {
                    reject(`Error loading image for ${record.name}`);
                };
            });
        });

        try {
            await Promise.all(promises);
            const content = await zip.generateAsync({type: 'blob'});

            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = 'QRKoder.zip';
            a.click();
        } catch (error) {
            console.error('Error creating zip file:', error);
        }
    };

    return (
        <div>
            <button onClick={lastNedZipArkiv}>Last ned ZIP med alle QR-koder</button>
            <ul style={{listStyleType: 'none', padding: 0}}>
                {records.map((record) => (
                    <li key={record.id} style={{listStyle: 'none'}}>
                        <div style={{textAlign: 'center'}}>
                            <img src={record.getCellValue(qrFieldId)[0].url} alt="QR Kode for plantevegg"/>
                            <p style={{fontSize: '4em', marginTop: '5px'}}>{record.name}</p> {}
                            <button onClick={() => lastNedSiglePNG(record)}>Last ned kun denne QR-koden</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

initializeBlock(() => <MerkelappGenerator/>);