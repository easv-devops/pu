import {Component, Input, OnInit} from '@angular/core';
import {GroupService, GroupInvite} from "../group.service";
import {UserService, InvitableUser, Pagination, PaginationResponse} from "../../user/user.service";
import {ToastController} from "@ionic/angular";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
})
export class InviteComponent  implements OnInit {
  @Input()
  group_id: number = -1;
  search_query: string = "";
  displayed_users: InvitableUser[] = [];
  current_page: number = 1;
  default_page_size: number = 5;
  total_pages: number = 0;

  constructor(private readonly group_service: GroupService,
              private readonly user_service: UserService,
              private readonly toast: ToastController) {}

  ngOnInit() {
    this.navigate_to();
  }

  async invite(user_id: number) {
    let group_invite: GroupInvite = {
      group_id: this.group_id,
      user_id: user_id
    }

    let success = await firstValueFrom(this.group_service.invite(group_invite));

    if (success) {
      await this.toast.create({
        message: 'Invite sent',
        color: 'success',
        duration: 5000
      });
    }
    else {
      await this.toast.create({
        message: 'Failed to invite',
        color: 'danger',
        duration: 5000
      });
    }
  }



  page_first() {
    this.current_page = 1;

    this.navigate_to();
  }

  page_previous() {
    this.current_page = this.current_page <= 1 ? 1 : this.current_page - 1;

    this.navigate_to();
  }

  page_next() {
    this.current_page = this.current_page >= this.total_pages ? this.total_pages : this.current_page + 1;

    this.navigate_to();
  }

  async page_last() {
    this.current_page = this.total_pages;

    this.navigate_to();
  }

  async navigate_to() {
    let pagination: Pagination = {
      current_page: this.current_page,
      page_size: this.default_page_size
    }

    let pagination_response: PaginationResponse<InvitableUser[]> = await firstValueFrom(this.user_service.get_invitable_users(this.search_query, pagination));

    this.total_pages = pagination_response.total_pages;

    this.displayed_users = pagination_response.values;
  }
}
