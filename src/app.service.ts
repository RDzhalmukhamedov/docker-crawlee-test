import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  createCheerioRouter,
  CheerioCrawler,
  RequestQueue,
  RouterHandler,
  CheerioCrawlingContext,
} from 'crawlee';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);
  private readonly router: RouterHandler<CheerioCrawlingContext>;
  private readonly crawler: CheerioCrawler;

  constructor() {
    this.router = createCheerioRouter();
    this.router.addHandler('handler', this.customHandler);
    this.crawler = new CheerioCrawler({
      additionalMimeTypes: ['application/atom+xml'],
      requestHandler: this.router,
      maxRequestRetries: 5,
    });
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('onApplicationBootstrap called');
    const queue = await RequestQueue.open();
    this.logger.log('Unreachable line during dockerized execution');
    queue.addRequest({
      url: 'https://www.kickstarter.com/projects/chibig/koa-and-the-five-pirates-of-mara-endless-summer-adventure/posts',
      label: 'handler',
      userData: { someProp: 'some-value' },
    });

    this.crawler.requestQueue = queue;
    await this.crawler.run();
  }

  private async customHandler({
    $,
    log,
  }: CheerioCrawlingContext): Promise<void> {
    log.info('handler called');
    const updatesCount = Number.parseInt(
      $('#updates-emoji').attr('emoji-data') ?? '0',
    );
    log.info('handler finished', { updatesCount: updatesCount });
  }
}
