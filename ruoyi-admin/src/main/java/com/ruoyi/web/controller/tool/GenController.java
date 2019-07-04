package com.ruoyi.web.controller.tool;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.StrUtil;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.page.TableDataInfo;
import com.ruoyi.common.support.Convert;
import com.ruoyi.framework.web.base.BaseController;
import com.ruoyi.generator.domain.TableInfo;
import com.ruoyi.generator.service.IGenService;
import com.ruoyi.generator.util.GenUtils;
import com.ruoyi.web.sql.SqlParserManager;
import org.apache.commons.io.IOUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 代码生成 操作处理
 *
 * @author ruoyi
 */
@Controller
@RequestMapping("/tool/gen")
public class GenController extends BaseController {
    private String prefix = "tool/gen";

    @Autowired
    private IGenService genService;

    @RequiresPermissions("tool:gen:view")
    @GetMapping()
    public String gen(ModelMap map) {
        // 获取当前项目的根目录
        // String dir = Thread.currentThread().getContextClassLoader().getResource("").getPath();
        String dir = System.getProperty("user.dir");
        map.put("dir", dir);
        return prefix + "/gen";
    }

    @RequiresPermissions("tool:gen:list")
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo list(TableInfo tableInfo) {
        startPage();
        List<TableInfo> list = genService.selectTableList(tableInfo);
        return getDataTable(list);
    }

    @RequiresPermissions("tool:gen:list")
    @GetMapping("/tableInfo")
    @ResponseBody
    public Map tableInfo(HttpServletRequest request) {
        Map retMap = new HashMap();
        TableInfo table = genService.getTableInfo(Convert.toStr(request.getParameter("table")));
        retMap.put("code", 0);
        retMap.put("msg", "");
        retMap.put("data", table.getColumns());
        retMap.put("count", table.getColumns().size());
        retMap.put("pk", table.getPrimaryKey());
        return retMap;
    }

    @RequiresPermissions("tool:gen:list")
    @PostMapping("/code-preview")
    @ResponseBody
    public Map previewCode(HttpServletRequest request) {
        Map retMap = new HashMap();
        String genType = Convert.toStr(request.getParameter("genType"), "table");
        if (genType.equals("sql")) {
            retMap = SqlParserManager.getInstance().parser(Convert.toStr(request.getParameter("sql")));
        } else {
            String table = Convert.toStr(request.getParameter("table"));
            Map<String, String[]> _params = request.getParameterMap();
            retMap = genService.previewCode(TableInfo.GenStyle.Web, table, _params);
        }
        return retMap;
    }

    @RequiresPermissions("tool:gen:list")
    @PostMapping("/code-gen-dir")
    @ResponseBody
    public Map genCodeDir(HttpServletRequest request) {
        Map<String, Object> retMap = new HashMap();
        retMap.put("res", true);
        try {
            Map<String, String[]> _params = request.getParameterMap();
            String table = GenUtils.getParam(_params, "table");
            String prefix = GenUtils.getParam(_params, "prefix");
            TableInfo ti = genService.getTableInfo(table, prefix, _params);
            Map codeMap = genService.previewCode(TableInfo.GenStyle.Web, table, _params);
            String dir = GenUtils.getParam(_params, "dir");
            if (!dir.endsWith(File.separator)) dir += File.separator;
            String moduleName = Convert.toStr(GenUtils.getParam(_params, "module"));
            // dir += moduleName + File.separator;

            String uri = Convert.toStr(GenUtils.getParam(_params, "uri"), "system/" + moduleName);
            boolean onlyListPage =
                    Convert.toStr(GenUtils.getParam(_params, "only-list"), "0").equals("1");

            for (Object fileName : codeMap.keySet()) {
                String _fileName = Convert.toStr(fileName, "");
                if (_fileName.indexOf("/") > 0)
                    _fileName = _fileName.substring(_fileName.lastIndexOf("/") + 1, _fileName.length());
                if (_fileName.endsWith(".vm")) {
                    _fileName = _fileName.substring(0, _fileName.length() - 3);
                }
                if (!_fileName.equals("")) {
                    if (_fileName.endsWith(".html")) { // html存放路径
                        if (onlyListPage) {
                            if (_fileName.indexOf("list") < 0) {
                                continue;
                            }
                        }
                        String _moduleFileName = _fileName;
                        if (_fileName.equals("list.html")) {
                            _moduleFileName = ti.getClassname() + ".html";
                        } else {
                            _moduleFileName = ti.getClassname() + "_" + _fileName;
                        }
                        String _filePath = dir + "src/main/resources/templates/" + uri + "/" + _moduleFileName;
                        if (FileUtil.exist(_filePath)) FileUtil.del(_filePath);
                        FileUtil.writeBytes(
                                Convert.toStr(codeMap.get(fileName.toString())).getBytes("UTF-8"), _filePath);
                    } else if (_fileName.endsWith(".js")) {
                        if (onlyListPage) {
                            if (_fileName.indexOf("list") < 0) {
                                continue;
                            }
                        }
                        String _moduleFileName = _fileName;
                        if (_fileName.equals("list.js")) {
                            _moduleFileName = ti.getClassname() + ".js";
                        }
                        if (_fileName.equals("add.js")) {
                            _moduleFileName = ti.getClassname() + "_add.js";
                        }
                        String _filePath =
                                dir + "src/main/resources/static/js/admin/" + moduleName + "/" + _moduleFileName;
                        if (FileUtil.exist(_filePath)) FileUtil.del(_filePath);
                        FileUtil.writeBytes(
                                Convert.toStr(codeMap.get(fileName.toString())).getBytes("UTF-8"), _filePath);
                    } else if (_fileName.endsWith(".xml")) {
                        String _moduleFileName = _fileName;
                        String _filePath =
                                dir
                                        + "src/main/resources/mapper/"
                                        + moduleName
                                        + "/"
                                        + ti.getClassName()
                                        + _fileName;
                        if (FileUtil.exist(_filePath)) FileUtil.del(_filePath);
                        FileUtil.writeBytes(
                                Convert.toStr(codeMap.get(fileName.toString())).getBytes("UTF-8"), _filePath);
                    } else if (_fileName.endsWith(".java")) {
                        String packagePath = GenUtils.getParam(_params, "package");
                        String _filePath =
                                dir + "src/main/java/" + StrUtil.replace(packagePath, ".", File.separator) + "/";
                        if (_fileName.equals("Controller.java")) {
                            _filePath += "controller/" + ti.getClassName() + _fileName;
                        } else if (_fileName.equals("domain.java")) {
                            _filePath += "domain/" + ti.getClassName() + ".java";
                        } else if (_fileName.equals("Mapper.java")) {
                            _filePath += "mapper/" + ti.getClassName() + _fileName;
                        } else if (_fileName.equals("Service.java")) {
                            _filePath += "service/" + "I" + ti.getClassName() + _fileName;
                        } else if (_fileName.equals("ServiceImpl.java")) {
                            _filePath += "service/impl/" + ti.getClassName() + _fileName;
                        }
                        if (FileUtil.exist(_filePath)) FileUtil.del(_filePath);
                        FileUtil.writeBytes(
                                Convert.toStr(codeMap.get(fileName.toString())).getBytes("UTF-8"), _filePath);
                    }
                }
            }
        } catch (Exception ex) {
            retMap.put("res", false);
            retMap.put("msg", ex.getMessage());
        }
        return retMap;
    }

    @RequiresPermissions("tool:gen:code")
    @Log(title = "根据预览的代码下载zip包", businessType = BusinessType.GENCODE)
    @GetMapping("/code-download")
    public void codeDownload(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String tableName = Convert.toStr(request.getParameter("table"));
        // byte[] data = genService.ge
        byte[] data = null;
        response.reset();
        response.setHeader("Content-Disposition", "attachment; filename=\"ruoyi.zip\"");
        response.addHeader("Content-Length", "" + data.length);
        response.setContentType("application/octet-stream; charset=UTF-8");

        IOUtils.write(data, response.getOutputStream());
    }

    /**
     * 生成代码
     */
    @RequiresPermissions("tool:gen:code")
    @Log(title = "代码生成", businessType = BusinessType.GENCODE)
    @GetMapping("/genCode/{tableName}")
    public void genCode(
            HttpServletRequest request,
            HttpServletResponse response,
            @PathVariable("tableName") String tableName)
            throws IOException {
        byte[] data = genService.generatorCode(tableName, null);
        response.reset();
        response.setHeader("Content-Disposition", "attachment; filename=\"ruoyi.zip\"");
        response.addHeader("Content-Length", "" + data.length);
        response.setContentType("application/octet-stream; charset=UTF-8");

        IOUtils.write(data, response.getOutputStream());
    }

    /**
     * 批量生成代码
     */
    @RequiresPermissions("tool:gen:code")
    @Log(title = "代码生成", businessType = BusinessType.GENCODE)
    @GetMapping("/batchGenCode")
    @ResponseBody
    public void batchGenCode(HttpServletResponse response, String tables) throws IOException {
        String[] tableNames = Convert.toStrArray(tables);
        byte[] data = genService.generatorCode(tableNames);
        response.reset();
        response.setHeader("Content-Disposition", "attachment; filename=\"ruoyi.zip\"");
        response.addHeader("Content-Length", "" + data.length);
        response.setContentType("application/octet-stream; charset=UTF-8");

        IOUtils.write(data, response.getOutputStream());
    }

    @RequiresPermissions("tool:gen:code")
    @Log(title = "下载子工程", businessType = BusinessType.GENCODE)
    @GetMapping("/code-download-project")
    @ResponseBody
    public Map codeDownloadProject(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        Map<String, Object> retMap = new HashMap();
        retMap.put("res", true);
        String path = Convert.toStr(request.getParameter("dir"));
        String basePackage = Convert.toStr(request.getParameter("pack"), "com.ruoyi");

        String version = Convert.toStr(request.getParameter("version"), "3.2");
        String projectName = Convert.toStr(request.getParameter("projectName"), "test");

        path += (path.endsWith(File.separator) ? "" : File.separator) + projectName;

        // 生成maven项目结构
        File maven = new File(path);
        maven.mkdirs();
        File src = new File(maven, "src");
        src.mkdirs();
        File main = new File(src, "main");
        main.mkdir();
        File test = new File(src, "test");
        test.mkdir();
        File javsSource = new File(main, "java");
        javsSource.mkdir();
        File resource = new File(main, "resources");
        resource.mkdir();
        File sql = new File(resource, "sql");
        sql.mkdir();
        File staticFile = new File(resource, "static");
        staticFile.mkdir();
        File templatesFile = new File(resource, "templates");
        templatesFile.mkdir();

        String codePath = basePackage.replace(".", "/");
        File codeFile = new File(javsSource, codePath);
        codeFile.mkdirs();

        Map sourceFilesMap = genService.generatorProjectCode(projectName, version, basePackage);

        FileWriter fw = null;

        // 先生成入口程序

        FileUtil.writeString(
                Convert.toStr(sourceFilesMap.get("vm/project/main.java.vm")),
                new File(codeFile, "MainApplication.java"),
                "UTF-8");
        FileUtil.writeString(
                Convert.toStr(sourceFilesMap.get("vm/project/pom.xml.vm")),
                new File(maven, "pom.xml"),
                "UTF-8");

        // 复制当前项目的配置文件
        File config = copy(resource, "application.yml");
        // TODO： 给application.yml的typeAliasesPackage设置子工程基类的扫描实体包

        copy(resource, "application-druid.yml");
        copy(resource, "logback.xml");
        copy(resource, "banner.txt");

        return retMap;
    }

    private File copy(File root, String fileName) throws IOException {
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        InputStream input = loader.getResourceAsStream(fileName);
        if (input == null) {
            return null;
        }

        File target = new File(root, fileName);
        FileOutputStream output = new FileOutputStream(target);
        try {

            byte[] buf = new byte[1024];
            int bytesRead;
            while ((bytesRead = input.read(buf)) > 0) {
                output.write(buf, 0, bytesRead);
            }
        } finally {
            input.close();
            output.close();
        }
        return target;
    }
}
