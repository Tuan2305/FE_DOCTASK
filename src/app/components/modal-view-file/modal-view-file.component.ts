import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
// import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@Component({
  selector: 'app-modal-view-file',
  templateUrl: './modal-view-file.component.html',
  styleUrl: './modal-view-file.component.css',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    PdfViewerModule,
    NgxDocViewerModule,
  ],
})
export class ModalViewFileComponent {
  pdfSrc = '';
  doc =
    'http://103.252.72.72:9001/api/v1/buckets/doc/objects/metadata?prefix=Role-userRole.docx&versionID=null';

  @Input() fileUrl: string = '';
  @Input() fileName: string = '';

  isVisible = false;
  safeFileUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.fileUrl) {
      this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.fileUrl
      );
    }
  }

  isNullFile(): boolean {
    return this.fileUrl !== '';
  }

  showModal(): void {
    if (!this.fileUrl) return;

    if (this.isPdf(this.fileUrl)) {
      this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.fileUrl
      );
    } else if (this.isDocxFile(this.fileUrl)) {
      this.safeFileUrl = this.getGoogleDocViewerUrl(this.fileUrl);
    } else {
      this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.fileUrl
      );
    }
    console.log(this.isDocxFile(this.fileUrl));
    this.isVisible = true;
    document.body.style.overflow = 'hidden';
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  isImage(fileUrl: string): boolean {
    return /\.(png|jpe?g|gif)$/i.test(fileUrl);
  }

  isPdf(file: string): boolean {
    return file.toLowerCase().endsWith('.pdf');
  }

  isDocxFile(file: string): boolean {
    return (
      file.toLowerCase().endsWith('.docx') ||
      file.toLowerCase().endsWith('.doc')
    );
  }

  getGoogleDocViewerUrl(fileUrl: string): SafeResourceUrl {
    const encodedUrl = encodeURIComponent(fileUrl);
    const googleViewer = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(googleViewer);
  }
}
