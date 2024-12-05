Untuk menambah menu sidebar
    - tambah sidebar -> src -> components -> layouts -> sidebar -> index.tsx 
    - tambahkan di listSidebar

Untuk menambah sub menu homepage (src-> pages->homepage)
    1. buat propertynya dulu. base on backend di src -> components -> types -> {namafile}
    2. buat widget add/edit dialog. src ->components ->widgets -> (bikin folder baru) {nama}_dialog
    3. buat index.tsx nya dan scss nya
    4. buat widget card loaded dialog. src -> components-> widgets -> card_{nama}_loaded
    5. buat index.tsx dam scss
    6. kemudian ke homepage.tsx dan ubah beberapa code :
        - tambahkan fetch dan usestate nya
        - handleEdit
        - getDialogContent
        - di div 