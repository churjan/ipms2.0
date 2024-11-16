import { RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle,Route } from '@angular/router';

/**
 * 重写angular路由重用策略，路由重用（多标签页实现）和路由懒加载最终解决方案
 */
export class SimpleReuseStrategy implements RouteReuseStrategy {

    public static handlers: { [key: string]: DetachedRouteHandle } = {};

    private static waitDelete: string;

    /** 表示对所有路由允许复用，返回true，说明允许复用， 如果你有路由不想利用可以在这加一些业务逻辑判断 */
    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.data['keepAlive'];
    }

    /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
    public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        if (SimpleReuseStrategy.waitDelete && SimpleReuseStrategy.waitDelete == this.getRouteUrl(route)) {
            //如果待删除是当前路由则不存储快照
            SimpleReuseStrategy.waitDelete = null;
            return;
        }
        SimpleReuseStrategy.handlers[this.getRouteUrl(route)] = handle;
        localStorage.setItem("lastUrl",route.routeConfig.path)

        /*
          This is where we circumvent the error.
          Detached route includes nested routes, which causes error when parent route does not include the same nested routes
          To prevent this, whenever a parent route is stored, we change/add a redirect route to the current child route
          (这是我们规避错误的地方。
          分离的路由包括嵌套路由，当父路由不包含相同的嵌套路由时会导致错误
          为了防止这种情况，无论何时存储父路由，我们都会将重定向路由更改/添加到当前子路由)
        */
        let config: Route = route.routeConfig;
        if(config) {
            let childRoute: ActivatedRouteSnapshot = route.firstChild;
            let futureRedirectTo = childRoute ? childRoute.url.map(function(urlSegment) {
                return urlSegment.path;
            }).join('/') : '';
            let childRouteConfigs: Route[] = config.children;
            if(childRouteConfigs) {
                let redirectConfigIndex: number;
                let redirectConfig: Route = childRouteConfigs.find(function(childRouteConfig, index) {
                    if(childRouteConfig.path === '' && !!childRouteConfig.redirectTo) {
                        redirectConfigIndex = index;
                        return true;
                    }
                    return false;
                });
                //Redirect route exists(重定向路由存在)
                if(redirectConfig) {
                    if(futureRedirectTo !== '') {
                        //Current activated route has child routes, update redirectTo(当前激活的路由有子路由，更新redirectTo )
                        redirectConfig.redirectTo = futureRedirectTo;
                    } else {
                        //Current activated route has no child routes, remove the redirect (otherwise retrieval will always fail for this route)（当前激活的路由没有子路由，删除重定向（否则此路由的检索将始终失败））
                        childRouteConfigs.splice(redirectConfigIndex, 1);
                    }
                } else if(futureRedirectTo !== '') {
                    childRouteConfigs.push({
                        path: '',
                        redirectTo: futureRedirectTo,
                        pathMatch: 'full'
                    });
                }
            }
        }
    }

    /** 若 path 在缓存中有的都认为允许还原路由 */
    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        localStorage.setItem("lastUrl",route.queryParams.redirect?route.queryParams.redirect:route.routeConfig.path)
        return !!SimpleReuseStrategy.handlers[this.getRouteUrl(route)]
    }

    /** 从缓存中获取快照，若无则返回nul */
    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        localStorage.setItem("lastUrl",route.routeConfig.path)
        //We don't store lazy loaded routes, so don't even bother trying to retrieve them（我们不会存储懒加载路线，所以甚至不试图检索他们）
        if(!route.routeConfig) {
            return false;
        }
        return SimpleReuseStrategy.handlers[this.getRouteUrl(route)]
    }

    /** 进入路由触发，判断是否同一路由 */
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        /* return future.routeConfig===curr.routeConfig && 
            JSON.stringify(future.params)==JSON.stringify(curr.params); */
        return future.routeConfig===curr.routeConfig;
    }

    /** 根据路由url并加以处理 **/
    private getRouteUrl(route: ActivatedRouteSnapshot) {
        let url = route['_routerState'].url;
        if(url.indexOf("?") > 0) url = url.split("?")[0];
        return url.replace(/\//g, '_');
    }

    /** 根据路由缓存key，删除快照 **/
    public static deleteRouteSnapshot(name: string): void {
        if (SimpleReuseStrategy.handlers[name]) {
            delete SimpleReuseStrategy.handlers[name];
        } else {
            SimpleReuseStrategy.waitDelete = name;
        }
    }

    /** 删除全部快照 **/
    public static deleteAllRouteSnapshot(): void {
        SimpleReuseStrategy.handlers = {}
    }
}