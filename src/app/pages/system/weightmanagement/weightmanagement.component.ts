import { Component, OnInit } from '@angular/core';
import { WeightmanagementService } from './weightmanagement.service';
@Component({
    selector: 'app-weightmanagement',
    templateUrl: './weightmanagement.component.html',
    styleUrls: ['./weightmanagement.component.less'],
})
export class WeightmanagementComponent implements OnInit {
    editCache = {};
    listOfData = [];

    constructor(private weightmanagementService: WeightmanagementService) { }

    ngOnInit(): void {
        this.fetchList();
    }

    fetchList() {
        this.weightmanagementService.fetchList().then((data: any) => {
            data.forEach(item => {
                item.id = String(Math.random()).slice(2)
            })
            this.listOfData = data;
            this.updateEditCache();
        });
    }
    editData(data) {
        this.weightmanagementService.editData(data).then((data: any) => { });
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    cancelEdit(id: string): void {
        const index = this.listOfData.findIndex((item) => item.id === id);
        this.editCache[id] = {
            data: { ...this.listOfData[index] },
            edit: false,
        };
    }

    saveEdit(id: string): void {
        const index = this.listOfData.findIndex((item) => item.id === id);
        Object.assign(this.listOfData[index], this.editCache[id].data);
        this.editCache[id].edit = false;
        this.editData(this.editCache[id].data)
    }

    updateEditCache(): void {
        this.listOfData.forEach((item) => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item },
            };
        });
    }
}
