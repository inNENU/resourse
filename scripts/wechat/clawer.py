import os
import re
import requests
import time
import traceback

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService


class Spider(object):
    '''
    微信公众号文章爬虫
    '''

    def __init__(self):
        self.headers = {
            "HOST": "mp.weixin.qq.com",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36"
        }

    def create_driver(self):
        '''
        初始化 webdriver
        '''
        try:

            options = webdriver.ChromeOptions()
            # 禁用gpu加速，防止出一些未知bug
            options.add_argument('--disable-gpu')

            # 可以去 http://chromedriver.chromium.org/downloads 下载你的chrome对应版本
            service = ChromeService(executable_path='./chromedriver.exe')
            self.driver = webdriver.Chrome(
                service=service, options=options)
            # 设置一个隐性等待 5s
            self.driver.implicitly_wait(5)

        except Exception as e:
            traceback.print_exc()

    def log(self, msg):
        '''
        格式化打印
        '''
        print('------ %s ------' % msg)

    def login(self):
        '''
        登录拿 cookies
        '''
        try:
            self.create_driver()
            try:
                # 访问微信公众平台
                self.driver.get('https://mp.weixin.qq.com/')
                # 等待网页加载完毕
                time.sleep(3)
                # # 输入账号
                # self.driver.find_element(
                #     By.XPATH, "./*//input[@name='account']").clear()
                # self.driver.find_element(
                #     By.XPATH, "./*//input[@name='account']").send_keys(account)
                # # 输入密码
                # self.driver.find_element(
                #     By.XPATH, "./*//input[@name='password']").clear()
                # self.driver.find_element(
                #     By.XPATH, "./*//input[@name='password']").send_keys(pwd)
                # # 点击登录
                # self.driver.find_elements(
                #     By.CLASS_NAME, 'btn_login')[0].click()
                self.log("请拿手机扫码二维码登录公众号")
                # Wait for QRCode scanning
                time.sleep(15)
                self.log("登录成功")
                self.cookies = dict([[x['name'], x['value']]
                                    for x in self.driver.get_cookies()])

            except Exception as e:
                traceback.print_exc()
            finally:
                self.driver.quit()

        except Exception as e:
            traceback.print_exc()

    def get_page(self, fakeid, token, begin):
        try:
            search_url = 'https://mp.weixin.qq.com/cgi-bin/appmsg?'
            params = {
                'action': 'list_ex',
                'begin': str(begin),
                'count': '5',
                'fakeid': fakeid,
                'type': '9',
                'query': '',
                'token': token,
                'lang': 'zh_CN',
                'f': 'json',
                'ajax': '1',
            }
            # 打开搜索的微信公众号文章列表页
            response = requests.get(
                search_url, cookies=self.cookies, headers=self.headers, params=params)

            # time.sleep(2)

            list = []

            for article in response.json().get('app_msg_list', []):
                list.append({
                    'url': article.get('link'),
                    'cover': article.get('cover'),
                    'title': article.get('title'),
                    'desc': article.get('digest', '')
                })
                self.log({
                    'url': article.get('link'),
                    'cover': article.get('cover'),
                    'title': article.get('title'),
                    'desc': article.get('digest', '')
                })

            return list

        except Exception as e:
            traceback.print_exc()

            return []

    def write_article(self, account_id, filename):
        result = ''

        with open('../../data/account/' + filename + '.yml', 'r', encoding="utf-8") as f:
            content = f.read()

        try:
            url = 'https://mp.weixin.qq.com'

            # Get token from homepage url
            response = requests.get(url=url, cookies=self.cookies)
            token = re.findall(r'token=(\d+)', str(response.url))[0]

            # time.sleep(2)

            self.log('正在查询[ %s ]相关公众号' % account_id)
            search_url = 'https://mp.weixin.qq.com/cgi-bin/searchbiz?'
            params = {
                'action': 'search_biz',
                'begin': '0',
                'count': '5',
                'query': account_id,
                'token': token,
                'lang': 'zh_CN',
                'ajax': '1',
                'f': 'json',
            }
            response = requests.get(
                search_url, cookies=self.cookies, headers=self.headers, params=params)

            # time.sleep(2)

            # Get fist result
            account_info = response.json().get('list')[0]
            # Get fake ID
            fakeid = account_info.get('fakeid')
            nickname = account_info.get('nickname')

            self.log('正在查询公众号[ %s ]相关文章' % nickname)

            should_fetch = True
            begin = 0

            while (should_fetch & begin < 100):
                list = self.get_page(fakeid, token, begin)

                for article in list:
                    if re.search(article['url'], content) == None:
                        result += '\n  - cover: ' + \
                            article['cover'] + '\n    title: ' + \
                            article['title'] +\
                            ('\n    desc: ' + article['desc']) if article['desc'] else '' +\
                            '\n    url: ' + article['url'] + '\n'
                        begin += 5
                    else:
                        should_fetch = False

        except Exception as e:
            traceback.print_exc(e)

        with open('../../data/account/' + filename + '.yml', 'w', encoding="utf-8") as f:
            f.write(content.replace('article:\n', 'article:\n' + result))


if __name__ == '__main__':
    spider = Spider()
    spider.login()
    spider.write_article('nenuxsh40', 'nenuyouth')
