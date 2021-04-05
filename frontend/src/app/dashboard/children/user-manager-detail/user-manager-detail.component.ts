import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-manager-detail',
  templateUrl: './user-manager-detail.component.html',
  styleUrls: ['./user-manager-detail.component.css']
})
export class UserManagerDetailComponent implements OnInit {

  userId = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.userId = params.id);
  }

}
