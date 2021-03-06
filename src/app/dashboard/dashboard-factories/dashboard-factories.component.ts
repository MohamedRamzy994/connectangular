import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationComponent } from '../utilties/confirmation/confirmation.component';

@Component({
  selector: 'app-dashboard-factories',
  templateUrl: './dashboard-factories.component.html',
  styleUrls: ['./dashboard-factories.component.scss']
})
export class DashboardFactoriesComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('matAddService') matAddService!: MatExpansionPanel;
  @ViewChild('matAddServiceName') matAddServiceName!: MatInput;
  @ViewChild('fileUploadPath') fileUploadPath!: MatInput;
  @ViewChild('fileUploadImage') fileUploadImage!: ElementRef;


  options!: FormGroup;
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol','actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor( fb:FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) 
  {
    this.options =  fb.group({
     serviceName:new FormControl('',[Validators.required, Validators.maxLength(20)]) ,
     serviceDetails:new FormControl('',[Validators.required]),
     serviceDateTime: new FormControl('',[Validators.required]),
     servicePosition:new FormControl('')
    });
  
   }

  ngOnInit(): void {
  }
  /**
   * addService
   */
  public addService() {
  const rowSelected=this.options.get('servicePosition')?.value;
 
    if (rowSelected!=null) {
     
      debugger;

    let row= ELEMENT_DATA.find(x=>x.position==rowSelected);
    if (row!=null) {
      row.name = this.options.get('serviceName')?.value;
      row.weight = this.options.get('serviceDetails')?.value;
      row.symbol = this.options.get('serviceDateTime')?.value;
    } 
    
    
      

    } else {
      let newRow:PeriodicElement = {select:false,name:this.options.get('serviceName')?.value,position:100,weight:this.options.get('serviceDetails')?.value, symbol:this.options.get('serviceDateTime')?.value};
      ELEMENT_DATA.push(newRow);
    }

  

    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this._snackBar.open('?????? ?????????? ???????? ??????????','??????????' ,{
      duration:  5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
    this.options.reset();
  }
  public removeService(){
    this.options.reset();
  }
  public removeRow(e:PeriodicElement){
    const dialogRef= this.dialog.open(ConfirmationComponent,{
      width:'100%',
      direction:'rtl',
     
     });
     const subscribeDialog = dialogRef.componentInstance.confirmed.subscribe((data) => {
    
      if (data) {
        let removeRow:number= ELEMENT_DATA.findIndex(x=>x.position == e.position);
        ELEMENT_DATA.splice(removeRow,1);
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this._snackBar.open('?????? ?????? ?????????????? ??????????','??????????' ,{
          duration:  5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
       
       } else {
         dialogRef.close();
       }
    });

    dialogRef.afterClosed().subscribe(result => {      
      subscribeDialog.unsubscribe();
    });
     
  
  }
  public openAddService():void{

    this.matAddService.open()
    this.matAddServiceName.focus();
     
    }
    /**
     * editRow
     */
    public editRow(element:PeriodicElement) {
      
      this.options.get('serviceName')?.setValue(element.name);
      this.options.get('servicePosition')?.setValue(element.position);
      this.options.get('serviceDetails')?.setValue(element.weight);
      this.options.get('serviceDateTime')?.setValue(new Date(element.symbol));

        this.openAddService();

    }

    getImagePath($event:any):void{

      const reader = new FileReader();
		   reader.readAsDataURL($event.target.files[0]);
     
      reader.onload=(e)=>{
        this.fileUploadPath.value=reader.result?.slice(0,100);
      this.fileUploadImage.nativeElement.src=reader.result;
      }



    }

}
export interface PeriodicElement {
  select:boolean;
  name: string|null;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {select:false,position: 1, name: '?????????? ??????????????', weight: 1.0079, symbol: '4/12/2022'},
  {select:false, position: 2, name: '?????????? ??????????????', weight: 4.0026, symbol: '4/12/2022'},
  {select:false, position: 3, name: '?????????? ??????????????', weight: 6.941, symbol: '4/12/2022'},
  {select:false, position: 4, name: '?????????? ??????????????', weight: 9.0122, symbol: '4/12/2022'},
  {select:false, position: 5, name: '?????????? ??????????????', weight: 10.811, symbol: '4/12/2022'},
  {select:false, position: 6, name: '?????????? ??????????????', weight: 12.0107, symbol: '4/12/2022'},
  {select:false, position: 7, name: '?????????? ??????????????', weight: 14.0067, symbol: '4/12/2022'},
  {select:false, position: 8, name: '?????????? ??????????????', weight: 15.9994, symbol: '4/12/2022'},
  {select:false, position: 9, name: '?????????? ??????????????', weight: 18.9984, symbol: '4/12/2022'},
  {select:false, position: 10, name: '?????????? ??????????????', weight: 20.1797, symbol: '4/12/2022'},
];


